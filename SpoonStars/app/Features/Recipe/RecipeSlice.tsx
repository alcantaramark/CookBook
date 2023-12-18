import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchByTag, searchPopular } from "./Services/Queries/SearchRecipes";
import { RootState } from "./../../Redux/Store";
import recipePreference from './Data/RecipePreference.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recipe, recipeTag, pageInfo } from '../../../types/App_Types';

export interface recipesState {
    recipes: recipePayload[],
    status: string,
    tags: recipeTag[],
    preferenceStatus: string,
    pagination: pageInfo,
    errors: string
};

export interface recipePayload {
    node: recipe,
    cursor: string
};

const initialState: recipesState = {
    recipes: [],
    status: "idle",
    preferenceStatus: "idle",
    tags: [],
    pagination: {
        startCursor: '',
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false
    },
    errors:''
};

export const fetchRecipes = createAsyncThunk("recipe/fetchRecipes", async (_, { getState, rejectWithValue, fulfillWithValue }) => {
    try{
        const state = getState() as RootState;
        const preferred = state.recipe.tags.find(tag => tag.preferred == true);

        const recipes = preferred == undefined ? await searchPopular().then(response => response.json()) :
            await searchByTag(preferred.name).then(response => response.json());
        
        const filteredRecipes = preferred == undefined ? recipes.data.popularRecipes : recipes.data.recipesByTag;
        return fulfillWithValue(filteredRecipes);
    }
    catch(e){
        return rejectWithValue("Error loading recipes");
    }
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
        clearRecipes: state => { 
            state.recipes = new Array<recipePayload>();
            state.errors = '';
            state.pagination = {
                startCursor: '',
                endCursor: '',
                hasNextPage: false,
                hasPreviousPage: false
            };
            state.preferenceStatus = '';
            state.status = 'idle';
        },
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
            state.errors = '';
        })
        .addCase(fetchRecipes.fulfilled, (state, action) => {
            if(action.payload != null){
                if (!action.payload.pageInfo.hasPreviousPage) {
                    state.recipes = [];
                }

                action.payload.edges.map((item: recipePayload) => {
                    if (state.recipes.findIndex(recipe => recipe.node.id === item.node.id) < 0)  {
                        state.recipes.push(item);
                    }
                })
                state.pagination = action.payload.pageInfo;
                state.errors = '';
            }
            else{
                state.errors = 'No recipes found';
            }
            state.status = "succeeded";
        })
        .addCase(fetchRecipes.rejected, (state, action) => {
            if (state.status === 'loading') {
                state.status = 'idle';
                state.errors = action.payload as string;
            }
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
export const selectRecipesPageInfo = (state: RootState) => state.recipe.pagination;
export const selectRecipePreferencesStatus = (state: RootState) => state.recipe.preferenceStatus;
export const selectRecipeTags = (state: RootState) => state.recipe.tags;
export const selectRecipeErrors = (state: RootState) => state.recipe.errors;
export const { clearRecipes, updateRecipePreference } = RecipeSlice.actions;
export default RecipeSlice.reducer;