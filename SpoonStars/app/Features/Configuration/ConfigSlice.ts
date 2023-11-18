import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../Redux/Store";

export interface ConfigState {
    value: {
        suggesticUserId: string,
        suggesticAPIKey: string
    }
}

const initialState: ConfigState = {
    value: { 
        suggesticUserId: "",
        suggesticAPIKey: ""
    }
};

export const ConfigSlice = createSlice({
    name: "recipeConfig",
    initialState,
    reducers: {
        fetchConfig: (state, action: PayloadAction<ConfigState>) => {
            state.value = action.payload.value;
        }       
    }
});

export const { fetchConfig } = ConfigSlice.actions;
export const recipeAPIConfig = (state : RootState) => state.recipeConfig.value;
export default ConfigSlice.reducer;