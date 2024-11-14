document.addEventListener('DOMContentLoaded', () => {
    // Fetch the JSON
  
    fetch('r.json')
        .then(response => response.json())
        .then(data => {
            populateDropdown(data);
            setupDropdownListener(data);
        });
  
    // DOM Element constants
    const recipeDetails = document.getElementById('recipe-details');
    const recipeDropdown = document.getElementById('recipe-dropdown');
    const doubleServingsButton = document.getElementById('double-servings');
    const convertUnitsButton = document.getElementById('convert-units');
    let currentRecipe = null;
    let isImperial = false;
  
    // Dropdown menu with recipe names
    function populateDropdown(recipes) {
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Select a Recipe';
        defaultOption.value = '';
        recipeDropdown.appendChild(defaultOption);
  
        recipes.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe.name;
            option.textContent = recipe.name;
            recipeDropdown.appendChild(option);
        });
    }
  
    // Listen for dropdown selection changes
    function setupDropdownListener(recipes) {
        recipeDropdown.addEventListener('change', () => {
            const selectedRecipeName = recipeDropdown.value;
            const selectedRecipe = recipes.find(recipe => recipe.name === selectedRecipeName);
            if (selectedRecipe) {
                displayRecipe(selectedRecipe);
            } else {
                recipeDetails.classList.add('hidden');
            }
        });
    }
  
    // Recipe's details using innerHTML
    function displayRecipe(recipe) {
        currentRecipe = JSON.parse(JSON.stringify(recipe)); // Deep copy to avoid modifying original
        recipeDetails.classList.remove('hidden');
  
        recipeDetails.innerHTML = `
            <h2>${recipe.name}</h2>
            <img src="${recipe.image}" alt="${recipe.name}" style="max-width: 100%; border-radius: 10px; margin-bottom: 20px;">
            <p id="recipe-description">${recipe.description}</p>
            <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
            <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
            <p><strong>Servings:</strong> <span id="recipe-servings">${recipe.servings}</span> <button id="double-servings">Double It</button></p>
            <p><strong>Prep Time:</strong> ${formatTime(recipe.prepTime)}</p>
            <p><strong>Cook Time:</strong> ${formatTime(recipe.cookTime)}</p>
            
            <h3>Ingredients</h3>
            <ul id="recipe-ingredients">
                ${recipe.ingredients.map(ingredient => `<li>${ingredient.amount} ${ingredient.unit} ${ingredient.item}</li>`).join('')}
            </ul>
            <button id="convert-units">Convert Units</button>
  
            <h3>Nutritional Information</h3>
            <ul id="recipe-nutrition">
                ${Object.entries(recipe.nutritionalInfo).map(([key, value]) => `<li>${capitalizeFirstLetter(key)}: ${value}</li>`).join('')}
            </ul>
  
            <h3>Instructions</h3>
            <ol id="recipe-instructions">
                ${recipe.instructions.map(step => `<li>${step.text}</li>`).join('')}
            </ol>
  
            <h3>Tags</h3>
            <p id="recipe-tags">${recipe.tags.join(', ')}</p>
        `;
  
        // Reattach button event listeners
        document.getElementById('double-servings').onclick = doubleServings;
        document.getElementById('convert-units').onclick = convertUnits;
    }
  
    // Format time in hours and minutes
    function formatTime(minutes) {
        return minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`;
    }
  
    // Double servings function
    function doubleServings() {
        if (currentRecipe) {
            currentRecipe.servings *= 2;
            document.getElementById('recipe-servings').textContent = currentRecipe.servings;
  
            currentRecipe.ingredients.forEach(ingredient => {
                ingredient.amount *= 2;
            });
            displayIngredients(currentRecipe.ingredients);
  
            for (const key in currentRecipe.nutritionalInfo) {
                currentRecipe.nutritionalInfo[key] *= 2;
            }
            displayNutrition(currentRecipe.nutritionalInfo);
        }
    }
  
    // Display ingredients
    function displayIngredients(ingredients) {
        const recipeIngredients = document.getElementById('recipe-ingredients');
        recipeIngredients.innerHTML = ingredients.map(ingredient => `<li>${ingredient.amount} ${ingredient.unit} ${ingredient.item}</li>`).join('');
    }
  
    // Display nutritional information
    function displayNutrition(nutritionalInfo) {
        const recipeNutrition = document.getElementById('recipe-nutrition');
        recipeNutrition.innerHTML = Object.entries(nutritionalInfo).map(([key, value]) => `<li>${capitalizeFirstLetter(key)}: ${value}</li>`).join('');
    }
  
    // Convert units function
    function convertUnits() {
        if (currentRecipe) {
            isImperial = !isImperial;
            currentRecipe.ingredients.forEach(ingredient => {
                if (isImperial && ingredient.unit === 'grams') {
                    ingredient.amount = (ingredient.amount * 0.00220462).toFixed(2);
                    ingredient.unit = 'lbs';
                } else if (!isImperial && ingredient.unit === 'lbs') {
                    ingredient.amount = (ingredient.amount / 0.00220462).toFixed(2);
                    ingredient.unit = 'grams';
                }
            });
            displayIngredients(currentRecipe.ingredients);
        }
    }
  
    // Capitalize first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  });
  