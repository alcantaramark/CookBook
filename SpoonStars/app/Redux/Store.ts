import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import configReducer from "../Features/Configuration/ConfigSlice";
import recipeReducer from "../Features/Recipe/Scripts/RecipeSlice";
import searchReducer from "../Features/Search/Scripts/SearchSlice"

export const store = configureStore({
    reducer: {
        apiConfig: configReducer,
        recipe: recipeReducer,
        search: searchReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
