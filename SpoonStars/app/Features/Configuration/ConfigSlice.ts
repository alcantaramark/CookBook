import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../Redux/Store";

export interface ConfigState {
    suggesticUserId: string,
    suggesticAPIKey: string
}

const initialState: ConfigState = {
    suggesticUserId: "",
    suggesticAPIKey: ""
};

export const ConfigSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        fetchConfig: (state, action: PayloadAction<ConfigState>) => {
            state.suggesticAPIKey = action.payload.suggesticAPIKey;
            state.suggesticUserId = action.payload.suggesticUserId;
        }       
    }
});

export const { fetchConfig } = ConfigSlice.actions;
export const recipeAPIConfig = (state : RootState) => state.config;
export default ConfigSlice.reducer;