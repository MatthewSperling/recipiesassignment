document.addEventListener('DOMContentLoaded', () => {
  // Fetch the JSON

  fetch('r.json')
      .then(response => response.json())
      .then(data => {
          populateDropdown(data);
          setupDropdownListener(data);
      })


  const recipeDetails = document.getElementById('recipe-details');
  const recipeTitle = document.getElementById('recipe-title');
  const recipeImage = document.getElementById('recipe-image');
  const recipeDescription = document.getElementById('recipe-description');
  const recipeCuisine = document.getElementById('recipe-cuisine');
  const recipeDifficulty = document.getElementById('recipe-difficulty');
  const recipeServings = document.getElementById('recipe-servings');
  const recipePrepTime = document.getElementById('recipe-prep-time');
  const recipeCookTime = document.getElementById('recipe-cook-time');
  const recipeIngredients = document.getElementById('recipe-ingredients');
  const recipeInstructions = document.getElementById('recipe-instructions');
  const doubleServingsButton = document.getElementById('double-servings');
  const convertUnitsButton = document.getElementById('convert-units');
  let currentRecipe = null;
  let isImperial = false;

  // Dropdown menu with recipe names
  function populateDropdown(recipes) {
      const recipeDropdown = document.getElementById('recipe-dropdown');

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
      const recipeDropdown = document.getElementById('recipe-dropdown');
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

  // Recipe's details
  function displayRecipe(recipe) {
      currentRecipe = JSON.parse(JSON.stringify(recipe)); // Deep copy to avoid modifying original
      recipeDetails.classList.remove('hidden');

      recipeTitle.textContent = recipe.name;
      recipeImage.src = recipe.image;
      recipeDescription.textContent = recipe.description;
      recipeCuisine.textContent = recipe.cuisine;
      recipeDifficulty.textContent = recipe.difficulty;
      recipeServings.textContent = recipe.servings;
      recipePrepTime.textContent = formatTime(recipe.prepTime);
      recipeCookTime.textContent = formatTime(recipe.cookTime);

      displayIngredients(recipe.ingredients);
      displayInstructions(recipe.instructions);
      displayNutrition(recipe.nutritionalInfo);
      displayTags(recipe.tags);
  }

  // Time in hours and minutes
  function formatTime(minutes) {
      return minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`;
  }

  // Ingredients list
  function displayIngredients(ingredients) {
      recipeIngredients.innerHTML = '';
      ingredients.forEach(ingredient => {
          const listItem = document.createElement('li');
          listItem.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.item}`;
          recipeIngredients.appendChild(listItem);
      });
  }

  // Instructions list
  function displayInstructions(instructions) {
      recipeInstructions.innerHTML = '';
      instructions.forEach(step => {
          const listItem = document.createElement('li');
          listItem.textContent = step.text;
          recipeInstructions.appendChild(listItem);
      });
  }

  // Double servings
  doubleServingsButton.onclick = () => {
      if (currentRecipe) {
      currentRecipe.servings *= 2;
      recipeServings.textContent = currentRecipe.servings;

      currentRecipe.ingredients.forEach(ingredient => {
          ingredient.amount *= 2;
      });
      displayIngredients(currentRecipe.ingredients);

      for (const key in currentRecipe.nutritionalInfo) {
          currentRecipe.nutritionalInfo[key] *= 2;
      }
      displayNutrition(currentRecipe.nutritionalInfo);
      }
  };

  // Display nutritional information
  function displayNutrition(nutritionalInfo) {
      const recipeNutrition = document.getElementById('recipe-nutrition');
          recipeNutrition.innerHTML = ''; // Clear any existing content

      for (const [key, value] of Object.entries(nutritionalInfo)) {
          const listItem = document.createElement('li');
          listItem.textContent = `${capitalizeFirstLetter(key)}: ${value}`;
          recipeNutrition.appendChild(listItem);
      }
  };

  // Display tags
  function displayTags(tags) {
      const recipeTags = document.getElementById('recipe-tags');
      recipeTags.textContent = tags.join(', '); // Display tags as a comma-separated string
  };

  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Convert units
  convertUnitsButton.onclick = () => {
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
  };
});
