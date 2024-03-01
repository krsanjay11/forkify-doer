import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling sync await

// if(module.hot){
//   module.hot.accept();
// }

const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1);
    // console.log(id); // #5ed6604591c37cdc054bc886 without slicing #
    if(!id) return ;
    recipeView.renderSpinner();
    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) updating the bookmarks view
    // debugger; to debug the bug
    bookmarksView.update(model.state.bookmarks);
    
    // 2) loading recipe 
    await model.loadRecipe(id);
    
    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch(err){
    // console.log(err);
    recipeView.renderError();
  }
};
// controlRecipes();

const controlSearchResults = async function(){
  try {
    // 1. Get search query
    resultsView.renderSpinner();
    const query = searchView.getQuery(); 
    if(!query) return ;

    // 2. load search query
    await model.loadSearchResults(query);

    // 3. Render results
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination
    paginationView.render(model.state.search)
  } catch(err){
    console.error(err);
  }
};

const controlPagination = function(goToPage){
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

    // 4. Render new pagination
    paginationView.render(model.state.search)
};

const controlServings = function(newServings){
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function(){
  // 1. add/rmove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);
  // console.log(model.state.bookmarks);
  
  // 2. update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  // console.log(newRecipe); // dataArr - (12) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]  0 :  (2) ['title', 'TEST'], data - {title: 'TEST', sourceUrl: 'TEST', image: 'TEST', publisher: 'TEST', cookingTime: '23', …}
  try {
    // Show laading spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe); // {id: '65e0d0a4e4e99300142e0e05', title: 'TEST234', publisher: 'TEST234', SourceUrl: 'TEST234', image: 'TEST234', …}

    // render recipe
    recipeView.render(model.state.recipe);
    
    // Success message
    addRecipeView.renderMessage();
    
    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // state, title, url 

    // close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);
  } catch(err){
    console.error('😒', err);
    addRecipeView.renderError(err.message);
  }
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}; 
init();
