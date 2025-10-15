#Smart Recipe Generator
1. Project Description
An application that suggests recipes based on available ingredients, supporting manual input or image recognition, with filters, nutritional info, substitutions, and rating functionality.

2. Features
 Key features:
    * Manual input of ingredients
    * Upload image for ingredient recognition (using TensorFlow.js Coco-SSD)
    * Filter by dietary preference, cooking time, and difficulty
    * View recipes with detailed steps, ingredients, and nutrition
    * Suggest substitutions for missing ingredients
    * Rate recipes and save favorites locally
    * Offline support for already loaded recipes
    * Mobile-responsive design

3. How It Works
    * Load recipes from local JSON
    * Normalize input ingredients
    * Match recipes using scoring system
    * Apply filters for diet, time, difficulty
    * Suggest substitutions for missing ingredients
    * Ratings and favorites saved in browser localStorage
    * Image uploads analyzed via Coco-SSD model

4. Technologies Used
* HTML, CSS, JavaScript
* TensorFlow.js (Coco-SSD) for image detection
* LocalStorage for offline support
* Free hosting (Netlify, GitHub Pages)

5. Live Demo / Deployment
	https://animated-granita-245a3b.netlify.app/

6. Usage Instructions
* Step-by-step for users:
    1. Enter ingredients manually or upload image
    2. Select dietary preference, time, difficulty, servings
    3. Click Find Recipes
    4. View recipes, substitutions, and ratings

7. Project Approach / Write-up
	The Smart Recipe Generator suggests recipes based on available ingredients, dietary preferences, and cooking constraints. Recipes are scored using a matching algorithm that prioritizes 	 recipes with more matching ingredients and fewer missing ones. For missing items, a substitution logic provides alternatives, such as replacing milk with almond or soy milk.
	 
	Users can also upload images of ingredients, with Coco-SSD image recognition detecting common food items and auto-filling the input list. Filters for dietary preference, cooking time, and 	difficulty allow tailored results.

	The app includes a rating and favorites system using browser localStorage and supports offline usage for previously loaded recipes. The interface is mobile-responsive and user-friendly, 	ensuring easy navigation and efficient recipe discovery.

8. Recipe Database
* Mention number of recipes included (minimum 20)
* Could include a link or screenshot of recipes.json

9. Error Handling / UX
* Explain:
    * Loading indicators
    * Handling no matches
    * Invalid file uploads for image recognition
    * LocalStorage fallback

10. Acknowledgements / References
* TensorFlow.js Coco-SSD model
