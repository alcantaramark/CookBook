import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import configReducer from "../Features/Configuration/ConfigSlice";

export const store = configureStore({
    reducer: {
        apiConfig: configReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;