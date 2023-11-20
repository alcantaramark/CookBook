import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchPopular } from "./Services/Queries/SearchPopular";
import { RootState } from "./../../Redux/Store";
import { ConfigState } from "../Configuration/ConfigSlice";

export interface recipesState {
    recipes: recipe[],
    status: string 
};

export interface recipe {
    id: string,
    name: string
};

const initialState: recipesState = {
    recipes: [{
        id: "",
        name: ""
    }],
    status: "idle"
};

export const fetchPopularRecipes = createAsyncThunk("recipe/fetchPopularRecipes", async (keys: ConfigState["config"]) => {
    const { suggesticUserId, suggesticAPIKey } = keys;
    let recipes = await searchPopular(suggesticUserId, suggesticAPIKey).then(response => response.json());
    
    if (recipes.data.recipesByTag == null){
        recipes = [{
                "id": "I came from an Api Call - ID",
                "name": "I cam from an API Call - Name"
            }];
    }
    return recipes;
});

export const RecipeSlice = createSlice({
    name: "recipe",
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder.addCase(fetchPopularRecipes.pending, state => {
            state.status = "loading"
        })
        .addCase(fetchPopularRecipes.fulfilled, (state, action) => {
            state.recipes = action.payload;
            state.status = "succeeded";
        });
    }
});

export const selectRecipes = (state: RootState) => state.recipe.recipes;
export const selectRecipesStatus = (state: RootState) => state.recipe.status;
export default RecipeSlice.reducer;