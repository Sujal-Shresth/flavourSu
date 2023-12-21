// ADDING FUNCTIONALITIES TO THE BUTTONS

// Adding functionality to menu icon for phones
const menuIcon = document.getElementById("menuIcon");
const mobileMenu = document.getElementById("formobile");
const closeDiv = document.getElementById("closeDiv");
const homeButton = document.getElementById;
menuIcon.addEventListener("click", () => {
  mobileMenu.style.display = "block";
  closeDiv.style.display = "block";
});

closeDiv.addEventListener("click", removeNav);

function removeNav() {
  mobileMenu.style.display = "none";
  closeDiv.style.display = "none";
}

// Adding Functionality to the cross button of Modal
const closeButton = document.getElementById("closeButton");
const modal = document.getElementById("modal");
const blurDiv = document.getElementById("blur");

closeButton.addEventListener("click", () => {
  modal.style.display = "none";
  blurDiv.style.display = "none";
});

//Adding functionality to the nav buttons and other anchor tags
const logo = document.getElementById("logo");
const randomRecipeSection = document.getElementById("someThingNew");
const discoverButtons = [...document.querySelectorAll(".discover")];
const theMealDbButtons = [...document.querySelectorAll(".goToMealDb")];
const loadingContainer = document.getElementById("loadingContainer");

discoverButtons.forEach((button) => {
  button.addEventListener("click", () => {
    randomRecipeSection.scrollIntoView({ behavior: "smooth" });
  });
});

theMealDbButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.open("https://www.themealdb.com/", "_blank");
  });
});

//Adding functionality to the random recipe section
const randomFoodImageDiv = document.getElementById("randomFoodImage");

randomFoodImageDiv.addEventListener("click", () => {
  searchRecipe(randomFoodImageDiv.dataset.id);
});

const randomFoodImage = document.getElementById("randomFoodImage");
const randomFoodName = document.getElementsByClassName("randomFoodName");
const youtubeLinkRandom = document.getElementById("youtubeLinkRandom");

//Function to modify the popup / Modal with recipes
const modalIngredientList = document.getElementById("ingredientList");
const modalRecipeImage = document.getElementById("modalImage");
const modalInstructionList = document.getElementById("instructionList");
const modalRecipeName = document.getElementById("recipeName");
const youTubeLink = document.getElementById("youtubeLink");

function createPopup(meals) {
  modalIngredientList.innerHTML = "<h2>Ingredients:</h2>";
  modalInstructionList.innerHTML = "";
  let instruction = meals.strInstructions;
  let name = meals.strMeal;
  let image = meals.strMealThumb;
  let video = meals.strYoutube;
  youtubeLinkRandom.setAttribute("href", video);

  modalRecipeImage.setAttribute("src", image);

  modalRecipeName.innerText = name;

  for (i = 1; i <= 20; i++) {
    const ingredientKey = "strIngredient" + i;
    const ingredientAmountKey = "strMeasure" + i;
    if (
      meals[ingredientKey] !== "" &&
      meals[ingredientAmountKey] !== "" &&
      meals[ingredientKey] !== null &&
      meals[ingredientAmountKey] !== null
    ) {
      let ingredient = document.createElement("li");
      ingredient.innerText = `${meals[ingredientKey]}
      - (${meals[ingredientAmountKey]})`;
      modalIngredientList.append(ingredient);
    } else {
      break;
    }
  }

  let instructions = document.createElement("p");
  instructions.innerText = instruction;
  modalInstructionList.append(instructions);

  youTubeLink.setAttribute("href", video);

  loadingContainer.style.display = "none";
}

//Function to update the modal with random recipe contents
async function updateRandomSuggestion() {
  try {
    loadingContainer.style.display = "flex";
    let response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );

    let data = await response.json();

    let meals = data.meals[0];

    randomFoodImage.style.backgroundImage = `url("${meals.strMealThumb}")`;
    for (i = 0; i < randomFoodName.length; i++) {
      randomFoodName[i].innerText = meals.strMeal;
    }
    youtubeLinkRandom.setAttribute("href", meals.strYoutube);
    randomFoodImage.dataset.id = meals.idMeal;
    createPopup(meals);
  } catch (error) {
    handleError(error);
  }
}

updateRandomSuggestion();

//Making the search bar functional
const searchInputField = document.getElementById("searchBar");
const searchButtons = document.getElementsByClassName("searchInitiator");

searchInputField.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    callFetchRecipes();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("searchInitiator")) {
    callFetchRecipes();
  }
});

function callFetchRecipes() {
  let searchCategory = searchInputField.value;

  if (searchCategory.trim() === "") {
    logo.scrollIntoView({ behavior: "smooth" });
    setTimeout(function () {
      searchInputField.focus();
    }, 700);
  }
  //If only one letter has been given
  else if (searchCategory.trim().length === 1) {
    searchInputField.value = "";
    fetchRecipesByFirstLetter(searchCategory);
  }
  //Else
  else {
    searchInputField.value = "";
    fetchRecipesByCategory(searchCategory);
  }
}

//Function to display the error in the console
function handleError(error) {
  console.log("Error fetching recipes:", error);
}

//Asynchronours function to fetch recipes starting with given letter
async function fetchRecipesByFirstLetter(searchCategory) {
  try {
    loadingContainer.style.display = "flex";

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchCategory}`
    );
    const data = await response.json();

    if (data.meals) {
      appendSearchResults(data.meals, searchCategory);
    } else {
      handleNoResults(searchCategory);
    }
  } catch (error) {
    handleError(error);
  }
}

//Asynchronours function to fetch recipes by category
async function fetchRecipesByCategory(searchCategory) {
  try {
    loadingContainer.style.display = "flex";

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchCategory}`
    );
    const data = await response.json();

    if (data.meals) {
      appendSearchResults(data.meals, searchCategory);
    } else {
      fetchRecipesByName(searchCategory);
    }
  } catch (error) {
    handleError(error);
  }
}

//Asynchronours function to fetch recipes by name
async function fetchRecipesByName(searchCategory) {
  try {
    loadingContainer.style.display = "flex";

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchCategory}`
    );
    const data = await response.json();

    if (data.meals) {
      appendSearchResults(data.meals, searchCategory);
    } else {
      fetchRecipesByMainIngredient(searchCategory);
    }
  } catch (error) {
    handleError(error);
  }
}

//Asynchronours function to fetch recipes by main ingredient
async function fetchRecipesByMainIngredient(searchCategory) {
  try {
    loadingContainer.style.display = "flex";

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchCategory}`
    );
    const data = await response.json();

    if (data.meals) {
      appendSearchResults(data.meals, searchCategory);
    } else {
      handleNoResults(searchCategory);
    }
  } catch (error) {
    handleError(error);
  }
}

//Appending the results in the result div
const recipeRow1 = document.getElementById("recipeRow1");
const recipeRow2 = document.getElementById("recipeRow2");
const recipeSec = document.getElementById("recipeSec");
const searchCategoryName = document.getElementById("searchCategoryName");

//Function to handle no search results found
function handleNoResults(searchCategory) {
  recipeRow1.innerHTML = "";
  recipeRow2.innerHTML = "";
  recipeSec.scrollIntoView({ behavior: "smooth" });
  searchCategoryName.innerHTML = `No Results Found For
      <span id="searchCategory" class="cursive"
        >${searchCategory}</span
      > :(`;
  loadingContainer.style.display = "none";
}

//Function to append the results in the result div
function appendSearchResults(recipes, searchCategory) {
  recipeRow1.innerHTML = "";
  recipeRow2.innerHTML = "";
  searchCategoryName.innerHTML = `Showing results for
      <span id="searchCategory" class="cursive"
        >${searchCategory}</span
      >`;
  recipes.forEach((recipe, index) => {
    let div = document.createElement("div");
    let img = document.createElement("img");
    let p = document.createElement("p");

    div.classList.add("recipes");
    div.dataset.id = recipe.idMeal;
    img.setAttribute("src", recipe.strMealThumb);
    img.classList.add("recipeImage");
    p.classList.add("recipeName");
    p.innerText = recipe.strMeal;

    div.appendChild(img);
    div.appendChild(p);

    if (index % 2 == 0) {
      recipeRow1.append(div);
    } else {
      recipeRow2.append(div);
    }
  });
  recipeSec.scrollIntoView({ behavior: "smooth" });
  loadingContainer.style.display = "none";
}

//Event listener to display modal when the user clicks on the recipes
document.addEventListener("click", (e) => {
  const recipesElement = e.target.closest(".recipes");

  if (recipesElement) {
    searchRecipe(recipesElement.dataset.id);
  }
});

//Function to update the modal with the recipe clicked
async function searchRecipe(mealId) {
  try {
    loadingContainer.style.display = "flex";
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    let data = await response.json();

    modal.style.display = "flex";
    blurDiv.style.display = "block";
    createPopup(data.meals[0]);
  } catch (error) {
    handleError(error);
  }
}
