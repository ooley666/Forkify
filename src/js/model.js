import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers.js';

//keeps all the current data
export const state = {
  recipe: {},
  search: {
    query: ``,
    results: [],
    pageN: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  //extracts the recipe from the data
  const { recipe } = data.data;
  //saves the recipe from the API to the local  recipe, renaming some of the properties
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    img: recipe.image_url,
    ingr: recipe.ingredients,
    publisher: recipe.publisher,
    servN: recipe.servings,
    src: recipe.source_url,
    title: recipe.title,
    //short circuiting: if there is a key property in the recipe object, add it
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    //gets data for the given recipe id
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    );
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    //saving the given query to local object
    state.search.query = query;
    //getting data from the API, using given query
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    //saving all the results to local array
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        img: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.pageN = 1;
  } catch (error) {
    console.log(`${error} 💥💥💥`);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.pageN) {
  state.search.pageN = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingr.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servN;
  });
  state.recipe.servN = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  //mark current recipe as bookmarked
  state.recipe.bookmarked = true;
  setLocalStorage();
};
export const removeBookmark = function (id) {
  //finding the recipe in the bookmarked ones array
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  //deleting the recipe
  state.bookmarks.splice(index, 1);
  //setting
  state.recipe.bookmarked = false;
  setLocalStorage();
};
const setLocalStorage = function () {
  localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmarks));
};

const init = function () {
  //getting saved data from the local storage
  const data = JSON.parse(localStorage.getItem(`bookmarks`));
  if (!data) return;
  //saving data to the bookarks array for further render
  state.bookmarks = data;
  console.log(data);
};
init();

const createUserRecipeObj = function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      //filtering out non-ingredients properties and empty ingredients
      .filter(entry => entry[0].startsWith(`ingredient`) && entry[1] !== ``)
      //creating an ingredient object in place of ingredient, splitting the string
      .map(ing => {
        const ingrArr = ing[1].split(`,`).map(string => string.trim());
        if (ingrArr.length !== 3) throw new Error(`Wrong ingredient format!`);
        //destructuring array with data into individual variables
        const [quantity, unit, description] = ingrArr;
        //storing variables in form of object
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(Object.entries(newRecipe));
    console.log(ingredients);
    //returning the recipe in the form that the servrer accepts
    return {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
  } catch (err) {
    throw err;
  }
};

export const uploadRecipe = async function (newRecipe) {
  try {
    //creating a recipe object in a form that the server would accept
    const recipe = createUserRecipeObj(newRecipe);
    console.log(recipe);
    //uploading it, the call returns recipe +  API key
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    //storing the recipe as a current one
    state.recipe = createRecipeObject(data);
    //bookmarking the recipe
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
