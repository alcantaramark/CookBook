import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import configReducer from "../Features/Configuration/ConfigSlice";
import recipeReducer from "../Features/Recipe/Scripts/RecipeSlice";
import searchReducer from "../Features/Search/Scripts/SearchSlice"
import { searchApi } from "../Features/Api/SearchApi"

export const store = configureStore({
    reducer: {
        apiConfig: configReducer,
        recipe: recipeReducer,
        search: searchReducer,
        [searchApi.reducerPath]: searchApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(searchApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
