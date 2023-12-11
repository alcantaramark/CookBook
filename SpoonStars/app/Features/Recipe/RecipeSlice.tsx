import { Action, createAsyncThunk, createSlice, ThunkAction } from "@reduxjs/toolkit";
import { searchByTag, searchPopular } from "./Services/Queries/SearchRecipes";
import { RootState } from "./../../Redux/Store";
import recipePreference from './Data/RecipePreference.json';
import AsyncStorage from '@react-native-async-storage/async-storage';


export interface recipesState {
    recipes: recipe[],
    status: string,
    tags: recipeTag[],
    preferenceStatus: string,
    pageInfo: {
        startCursor: string,
        endCursor: string,
        hasNextPage: boolean,
        hasPreviousPage: boolean
    },
    errors: []
};

export interface recipeTag {
    name: string,
    preferred: boolean
}

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
    preferenceStatus: "idle",
    tags: [],
    pageInfo: {
        startCursor: '',
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false
    },
    errors:[]
};

export const fetchRecipes = createAsyncThunk("recipe/fetchRecipes", async (_, { getState }) => {
    const state = getState() as RootState;
    const preferred = state.recipe.tags.find(tag => tag.preferred == true);

    const recipes = preferred == undefined ? await searchPopular().then(response => response.json()) :
        await searchByTag(preferred.name).then(response => response.json());
    
    return preferred == undefined ? recipes.data.popularRecipes : recipes.data.recipesByTag;
});


export const loadRecipePreference = createAsyncThunk("recipe/loadRecipeTags", async () => {
    const tags = await AsyncStorage.getItem('recipe-tags');
    
    if (tags == null) {
        await AsyncStorage.setItem('recipe-tags', JSON.stringify(recipePreference.Tags));
    }

    return tags == null ? recipePreference.Tags : JSON.parse(tags);
});

export const saveRecipePreference = createAsyncThunk("recipe/setRecipePreference", async (_, { getState }) => {
    const state = getState() as RootState;
    await AsyncStorage.setItem('recipe-tags', JSON.stringify(state.recipe.tags));
});


export const RecipeSlice = createSlice({
    name: "recipe",
    initialState,
    reducers: { 
        clearPaging: state => { state.pageInfo.endCursor = ''; },
        updateRecipePreference: (state, action) => {
            const nextState = state.tags.map((item, i) => {
                if (action.payload == i) {
                    item.preferred = !item.preferred;
                }
                else {
                    item.preferred = false;
                }
                return item;
            })
            state.tags = nextState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRecipes.pending, state => {
            state.status = "loading"
        })
        .addCase(fetchRecipes.fulfilled, (state, action) => {
            if (!action.payload.pageInfo.hasPreviousPage) {
                state.recipes = [];
            }

            action.payload.edges.map((item: recipe) => {
                if (state.recipes.findIndex(recipe => recipe.node.id === item.node.id) < 0)  {
                    state.recipes.push(item);
                }
            })
            state.pageInfo = action.payload.pageInfo;
            state.status = "succeeded";
        })
        .addCase(fetchRecipes.rejected, state => {
            
        })
        .addCase(loadRecipePreference.pending, state => {
            state.preferenceStatus = "loading";
        })
        .addCase(loadRecipePreference.fulfilled, (state, action) => {
            state.tags = action.payload;
            state.preferenceStatus = "succeeded";
        });
    }
});

export const selectRecipes = (state: RootState) => state.recipe.recipes;
export const selectRecipesStatus = (state: RootState) => state.recipe.status;
export const selectRecipesPageInfo = (state: RootState) => state.recipe.pageInfo;
export const selectRecipePreferencesStatus = (state: RootState) => state.recipe.preferenceStatus;
export const selectRecipeTags = (state: RootState) => state.recipe.tags;
export const { clearPaging, updateRecipePreference } = RecipeSlice.actions;
export default RecipeSlice.reducer;