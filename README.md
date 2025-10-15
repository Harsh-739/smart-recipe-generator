Smart Recipe Generator

Smart Recipe Generator is a web application that suggests recipes based on the ingredients you have. It supports both manual ingredient input and image-based ingredient detection. Users can filter recipes by dietary preference, cooking time, and difficulty. The app also allows rating and saving favorite recipes, and works offline once loaded.

Features

Ingredient Input: Enter ingredients manually or upload an image to detect common food items.

Recipe Matching: Finds recipes based on your available ingredients.

Substitution Suggestions: Suggests alternatives for missing ingredients.

Filters: Filter recipes by dietary preference, cooking time, and difficulty.

Recipe Details: Shows ingredients, cooking steps, nutritional info, and substitutions.

Favorites & Ratings: Save favorite recipes and rate them; ratings are stored in localStorage.

Offline Support: Works offline after the first load (except for image recognition which requires internet).

Responsive Design: Mobile-friendly and intuitive UI.

Technologies Used

Frontend: HTML5, CSS3, JavaScript

Machine Learning: TensorFlow.js, Coco-SSD for ingredient detection

Data Storage: LocalStorage for ratings and favorites

Hosting: Can be deployed on free hosting platforms like Netlify, Vercel, or GitHub Pages

Installation & Setup

Clone the repository:

git clone <repository_url>


Navigate to the project folder:

cd smart-recipe-generator


Ensure your file structure is:

project/
├─ index.html
├─ style.css
├─ app.js
└─ data/
   └─ recipes.json


Open index.html in a browser to run the app.

⚠️ Note: Image recognition requires internet access to load the Coco-SSD model.

Usage

Manual Input: Type your available ingredients in the text box (comma-separated).

Upload Image: Select an image of your ingredients for automatic detection.

Filter Options: Select dietary preferences, cooking time, difficulty, and servings (optional).

Click Find Recipes to generate recipe suggestions.

View recipe details, nutritional information, and substitution suggestions.

Save favorite recipes or rate them.

Folder Structure
project/
├─ index.html         # Main HTML page
├─ style.css          # Styling
├─ app.js             # JavaScript logic
├─ data/
│   └─ recipes.json   # Recipe database
└─ README.md          # Project documentation

Approach

Recipes are loaded from a local JSON file.

User input and detected ingredients from images are normalized and matched against the recipe database.

Scores are calculated based on matched and missing ingredients.

Filters refine the results based on dietary preferences, cooking time, and difficulty.

Users can rate and save favorites; all data is stored in localStorage for offline access.

Notes

Minimum of 20 recipes included in the database.

Image recognition may only detect certain common ingredients from the COCO dataset.

Designed for responsive use on both desktop and mobile.

Live Demo

https://animated-granita-245a3b.netlify.app/
