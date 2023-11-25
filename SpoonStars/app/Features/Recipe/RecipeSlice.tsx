import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchPopular } from "./Services/Queries/SearchPopular";
import { RootState } from "./../../Redux/Store";

export interface recipesState {
    recipes: recipe[],
    status: string,
    pageInfo: {
        startCursor: string,
        endCursor: string,
        hasNextPage: boolean,
        hasPreviousPage: boolean
    }
};

export interface recipe {
    node: { 
        id: string,
        name: string,
        mainImage: string,
        totalTime: string
    },
    cursor: string
};

const initialState: recipesState = {
    recipes: [],
    status: "idle",
    pageInfo: {
        startCursor: '',
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false
    }
};

export const fetchPopularRecipes = createAsyncThunk("recipe/fetchPopularRecipes", async () => {
    let recipes = await searchPopular().then(response => response.json());
    return recipes.data.popularRecipes;
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
            state.recipes.push(...action.payload.edges);
            state.pageInfo = action.payload.pageInfo;
            state.status = "succeeded";
            console.log("pageInfo", state.pageInfo);
        });
    }
});

export const selectRecipes = (state: RootState) => state.recipe.recipes;
export const selectRecipesStatus = (state: RootState) => state.recipe.status;
export default RecipeSlice.reducer;