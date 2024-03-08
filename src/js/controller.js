import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';







// if (module.hot){
//   module.hot.accept();
// }
const controlRecipe = async function(){
  try{
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();
    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);
    
    // 1)Loading recipe
    await model.loadRecipe(id);
    
    // 2)Rendering recipe
    recipeView.render(model.state.recipe);


    
  }
  catch (err)
  {
   console.error(err);
    recipeView.renderError();
  }
};
const controlSearchResults= async function(){
  try{ 
    resultsView.renderSpinner();


    // 1) Get search query
    const query = searchView.getQuery(); 
    if(!query) return;

    // 2) Load search results
     await model.loadSearchResults(query);
    //  3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search)
  }catch(err)
  {
    console.log(err)
  
  }
};

const controlPagination= function(goToPage){
    //  1) Render results
    resultsView.render(model.getSearchResultsPage(goToPage));

    // 2) Render initial pagination buttons
    paginationView.render(model.state.search)
}

const controlServings= function(newServings){
  // update the recipe servings (in state)
  model.updateServings(newServings);

  //  update the recipe view

  recipeView.update(model.state.recipe);
};

const controlAddBookmark= function(){
  // add or remove bookmark
  if(!model.state.recipe.bookmarked){

    model.addBookmark(model.state.recipe);
  }
  else{

    model.deleteBookmark(model.state.recipe.id);
  }
  //  Update recipe view
  recipeView.update(model.state.recipe)

  // Render bookmarks
  bookmarkView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookmarkView.render(model.state.bookmarks)
}

const controlAddRecipe=async function(newRecipe){
try{
  // Show loading spinner
  addRecipeView.renderSpinner();

  // Upload the new recipe data
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);

  // Render recipe 
  recipeView.render(model.state.recipe)

  // Success message
  // debugger;
  addRecipeView.renderMessage();

  // Render bookmark view
  bookmarkView.render(model.state.bookmarks);

  // Change ID in url
  window.history.pushState(null,'',`#${model.state.recipe.id}`)

  // Close Form window
  setTimeout(function(){
    addRecipeView.toggleWindow()
  },MODAL_CLOSE_SEC*1000);

  }catch(err){
  console.error('@@',err);
  addRecipeView.renderError(err.message)
  }
}



const init = function(){
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  
}
init();



