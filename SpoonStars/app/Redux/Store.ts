import { configureStore } from "@reduxjs/toolkit";
import configReducer from "../Features/Configuration/ConfigSlice";
import recipeReducer from "./../Features/Recipe/RecipeSlice";

export const store = configureStore({
    reducer: {
        apiConfig: configReducer,
        recipe: recipeReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
