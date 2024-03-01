import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";
// import { getJSON, sendJSON } from "./helpers.js";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
};

const createRecipeObject = function(data){
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        SourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients, 
        ...(recipe.key && {key: recipe.key}), 
    }
}

export const loadRecipe = async function(id){
    try{
        // console.log(id); // #5ed6604591c37cdc054bc886
       const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886
        // console.log(data, 1); // {status: 'success', data: {…}}data: recipe: {publisher: 'My Baking Addiction', ingredients: Array(11), source_url: 'http://www.mybakingaddiction.com/pizza-dip/', image_url: 'http://forkify-api.herokuapp.com/images/PizzaDip21of14f05.jpg', title: 'Pizza Dip', …}[[Prototype]]: Objectstatus: "success"[[Prototype]]: Object 1
        
        state.recipe = createRecipeObject(data);
        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else 
            state.recipe.bookmarked = false;
        // console.log(state.recipe);
    } catch(err){
        throw err;
        // console.error(`${err} 😯`);
        // alert(err);
    } 
};
// loadRecipe('#5ed6604591c37cdc054bc886');

export const loadSearchResults = async function(query){
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        // console.log(data); // {status: 'success', results: 59, data: {…}}
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key}),
            };
        });
        state.search.page = 1;
        // console.log(state.search); // {query: 'pizza', resuts: Array(59)}
    } catch(err){
        throw err;
        console.error(`${err} 😯`);
    }
};
// loadSearchResults('pizza');

export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;
    const start = Number((+page - 1) * state.search.resultsPerPage); //0
    const end = Number(+page * state.search.resultsPerPage); //9
    return state.search.results.slice(start, end);
};

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
        // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
    });

    state.recipe.servings = newServings;
};

const persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
    // Add bookmark
    state.bookmarks.push(recipe);
    // Mark current recipe as bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
};

export const deleteBookmark = function(id){
    // Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);
    // Mark current recipe as NOT bookmarked
    if(state.recipe.id === id) state.recipe.bookmarked = false;

    persistBookmarks();
};

const clearBookmarks = function(){
    localStorage.clear('bookmarks');
};
// clearBookmarks();

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}
init();
// console.log(state.bookmarks);

export const uploadRecipe = async function(newRecipe){
    try{
        // console.log(newRecipe);
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            // const ingArr = ing[1].replaceAll(' ', '').split(',');
            const ingArr = ing[1].split(',').map(el => el.trim());
            if(ingArr.length !== 3) throw new Error('Wrong ingredient format! please use the correct format :)');
            const [quantity, unit, description] = ingArr;
            return {quantity: quantity ? +quantity : null, unit, description};
        });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: newRecipe.cookingTime,
            servings: newRecipe.servings,
            ingredients,
        }
        // console.log(recipe);
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        // console.log(data); // {status: 'success', data: {…}}
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch(err){
        throw err;
    }
};
// d39cc366-0322-4a0a-861e-0d0e14f1b71e
