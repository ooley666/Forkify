import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';


const controlRecipies = async function () {
  try {
    //getting id from the current page name
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0 update results view to mark selected recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1 loading recipe from the API
    await model.loadRecipe(id);
    const { recipe } = model.state;
    //2 rendering the recipe using the fetched data
    recipeView.render(recipe);
  } catch (e) {
    recipeView.renderMsg(`error`);
  }
};

const controlSearchResults = async function (e) {
  try {
    resultsView.renderSpinner();
    //getting query from the search bar
    const query = searchView.getQuery();
    if (!query) throw new Error();
    //loading the search results from the API
    await model.loadSearchResults(query);
    const { results } = model.state.search;
    //if there are no recipies matching the query - abort with an error message
    if (results.length === 0) throw new Error();
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
    //clearing the search input field
  } catch (error) {
    resultsView.renderMsg(`error`);
  }
};

//handler subbed to a listener im paginationViews
const controlPagination = function (goToPage) {
  //renders the next page
  resultsView.render(model.getSearchResultsPage(goToPage));
  //renders the buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipeView
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //if current recipe is not bookmarked - do it
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //if it is -- remove bookmark
  else model.removeBookmark(model.state.recipe.id);
  //update checks all the recipeView markup and changes only those elements that are mutatd
  recipeView.update(model.state.recipe);
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //renders spinner while uploading the recipe
    recipeView.renderSpinner();
    //asynchronous recipe upload
    await model.uploadRecipe(newRecipe);
    //rendering the new recipe in the recipeView area
    recipeView.render(model.state.recipe);
    //rendering bookmarks
    bookmarksView.render(model.state.bookmarks);
    //rendering a message of success
    addRecipeView.renderMsg(
      `message`,
      `The recipe has been successfully added ✅`
    );
    //change URL id
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);
    //closing form window
    setTimeout(() => {
      addRecipeView._toggleHidden();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err.message + `💥💥💥`);
    addRecipeView.renderMsg(`error`, err);
  }
};

const init = function () {
  //adding the handlers via PUB/SUB method
  bookmarksView.addRenderHandler(bookmarksView.render(model.state.bookmarks));
  recipeView.addRenderHandler(controlRecipies);
  recipeView.addServingsHandler(controlServings);
  recipeView.addBookmarksHandler(controlAddBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addClickHandler(controlPagination);
  addRecipeView.addUploadHandler(controlAddRecipe);
  recipeView.renderMsg(
    `message`,
    `Start by searching for a recipe or an ingredient. Have fun!`
  );
};
init();
