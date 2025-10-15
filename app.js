let recipes = [];
const SUBSTITUTIONS = {
  "milk": ["almond milk", "soy milk"],
  "butter": ["olive oil", "margarine"],
  "chicken": ["tofu", "paneer"],
  "pasta": ["spaghetti", "macaroni"],
  "tomato": ["canned tomato", "ketchup"]
};

// Dish to ingredients mapping
const DISH_MAP = {
  "fruit salad": ["apple","banana","grapes","honey","lemon juice"],
  "pasta primavera": ["pasta","tomato","bell pepper","garlic"],
  "banana smoothie": ["banana","milk","honey","ice"],
  "mango lassi": ["mango","yogurt","sugar","milk"],
  "chocolate milkshake": ["milk","cocoa powder","sugar","ice cream"],
  "veggie pizza": ["pizza base","tomato sauce","cheese","bell pepper","onion"]
};

// Load recipes JSON
async function loadRecipes() {
  const res = await fetch('data/recipes.json');
  recipes = await res.json();
}

// Normalize input
function normalizeList(arr) {
  return arr.map(i => i.trim().toLowerCase()).filter(Boolean);
}

// Local storage ratings
function getStored() { return JSON.parse(localStorage.getItem('savedRatings') || '{}'); }
function saveRating(id, r) { 
  const s = getStored(); 
  s[id] = r; 
  localStorage.setItem('savedRatings', JSON.stringify(s)); 
}

// Recipe matching
function matchRecipes(inputArr, diet, time, difficulty) {
  const inSet = new Set(inputArr);
  let results = recipes.map(r => {
    const ing = r.ingredients.map(x => x.toLowerCase());
    const matched = ing.filter(i => inSet.has(i));
    if (matched.length === 0) return null; // hide recipes with 0 matched ingredients
    const missing = ing.filter(i => !inSet.has(i));
    const score = matched.length - (missing.length * 0.3);
    return { ...r, matched, missing, score };
  }).filter(Boolean);

  if (diet && diet.toLowerCase() !== 'any') results = results.filter(r => r.diet === diet || r.diet === 'any');
  if (time && time.toLowerCase() !== 'any') results = results.filter(r => r.time <= parseInt(time));
  if (difficulty && difficulty.toLowerCase() !== 'any') results = results.filter(r => r.difficulty === difficulty);

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });

  return results;
}

// Render recipes
function renderRecipes(list) {
  const el = document.getElementById('recipesList');
  el.innerHTML = '';
  const stored = getStored();
  if (list.length === 0) { 
    el.innerHTML = '<p class="muted">No recipes found.</p>'; 
    return; 
  }

  const servingsInput = parseInt(document.getElementById('servingsInput').value) || 1;

  list.forEach(r => {
    const ingHTML = r.ingredients.map(i => r.matched.includes(i.toLowerCase()) ? `<b>${i}</b>` : i).join(', ');
    const subs = r.missing.map(m => SUBSTITUTIONS[m] ? `${m} → ${SUBSTITUTIONS[m].join('/')}` : '').filter(Boolean).join('; ');

    const servings = servingsInput || r.servings || 1;
    const cal = Math.round((r.nutrition?.calories || 0) * servings / (r.servings || 1));
    const protein = Math.round((r.nutrition?.protein || 0) * servings / (r.servings || 1));

    const li = document.createElement('li'); 
    li.className = 'recipe';
    li.innerHTML = `
      <h3>${r.name} <span class="badge">${r.time || '?'} min • ${r.difficulty || 'easy'}</span></h3>
      <p class="muted">Matched ingredients: ${r.matched.length}${r.missing.length > 0 ? '. Missing: ' + r.missing.join(', ') : ''}</p>
      <p><strong>Ingredients:</strong> ${ingHTML}</p>
      <p><strong>Steps:</strong> ${r.steps.join(' • ')}</p>
      <p><strong>Nutrition (per ${servings}):</strong> ${cal} kcal, ${protein} g protein</p>
      ${subs ? `<p><strong>Substitutions:</strong> ${subs}</p>` : ''}
      <div>
        <label>Rating:
          <select data-id="${r.id}" class="ratingSelect">
            <option value="">-</option>
            <option ${stored[r.id] == 1 ? 'selected' : ''} value="1">1</option>
            <option ${stored[r.id] == 2 ? 'selected' : ''} value="2">2</option>
            <option ${stored[r.id] == 3 ? 'selected' : ''} value="3">3</option>
            <option ${stored[r.id] == 4 ? 'selected' : ''} value="4">4</option>
            <option ${stored[r.id] == 5 ? 'selected' : ''} value="5">5</option>
          </select>
        </label>
        <button data-id="${r.id}" class="favBtn">❤ Save</button>
      </div>
    `;
    el.appendChild(li);
  });

  document.querySelectorAll('.ratingSelect').forEach(s => {
    s.addEventListener('change', e => {
      const id = e.target.dataset.id, v = parseInt(e.target.value);
      saveRating(id, v);
    });
  });

  document.querySelectorAll('.favBtn').forEach(b => {
    b.addEventListener('click', e => {
      const id = e.target.dataset.id;
      let favs = JSON.parse(localStorage.getItem('favs') || '[]');
      if (!favs.includes(id)) favs.push(id);
      localStorage.setItem('favs', JSON.stringify(favs));
      alert('Saved to favorites');
    });
  });
}

// **Food-specific image detection using MobileNet**
let model = null;
async function loadModel() {
  model = await mobilenet.load(); // MobileNet classifier
}

document.getElementById('imageUpload').addEventListener('change', async ev => {
  const f = ev.target.files[0];
  if (!f) return;
  const img = document.createElement('img');
  img.src = URL.createObjectURL(f);
  document.getElementById('detected').textContent = 'Detecting...';
  await img.decode();

  const predictions = await model.classify(img);
  console.log(predictions); // debug

  // Flexible mapping: match if prediction contains dish key
  const topClass = predictions[0]?.class.toLowerCase();
  let detected = [];
  for (let key in DISH_MAP) {
    if (topClass.includes(key)) {
      detected = DISH_MAP[key];
      break;
    }
  }

  if (detected.length === 0) {
    document.getElementById('detected').textContent = 'No ingredients detected. Try another image.';
    return;
  }

  document.getElementById('detected').textContent = 'Detected: ' + detected.join(', ');
  const cur = document.getElementById('ingredientsInput').value;
  document.getElementById('ingredientsInput').value = normalizeList((cur ? cur + ',' : '') + detected.join(',')).join(', ');
  findRecipes(); // automatically filter recipes
});

// Dynamic find function
function findRecipes() {
  const list = normalizeList(document.getElementById('ingredientsInput').value.split(','));
  const diet = document.getElementById('dietFilter').value;
  const time = document.getElementById('timeFilter').value;
  const difficulty = document.getElementById('difficultyFilter').value;
  const res = matchRecipes(list, diet, time, difficulty);
  renderRecipes(res.slice(0, 20));
}

// Event listeners
document.getElementById('findBtn').addEventListener('click', findRecipes);
['dietFilter','timeFilter','difficultyFilter','servingsInput'].forEach(id=>{
  document.getElementById(id).addEventListener('change', findRecipes);
  document.getElementById(id).addEventListener('input', findRecipes);
});

// Init
(async ()=>{
  document.getElementById('loading').classList.remove('hidden');
  await loadRecipes();
  await loadModel();
  document.getElementById('loading').classList.add('hidden');
})();
