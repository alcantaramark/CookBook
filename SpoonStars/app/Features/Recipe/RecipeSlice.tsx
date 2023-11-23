import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchPopular } from "./Services/Queries/SearchPopular";
import { RootState } from "./../../Redux/Store";

export interface recipesState {
    recipes: recipe[],
    status: string 
};

export interface recipe {
    node: { 
        id: string,
        name: string,
        mainImage: string,
        totalTime: string
    }
};

const initialState: recipesState = {
    recipes: [{
        node: { 
            id: "",
            name: "",
            mainImage: "",
            totalTime: ""
        }
    }],
    status: "idle"
};

export const fetchPopularRecipes = createAsyncThunk("recipe/fetchPopularRecipes", async () => {
    let recipes = await searchPopular().then(response => response.json());
    return recipes.data.popularRecipes.edges;
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