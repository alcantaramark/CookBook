import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../Redux/Store";

export interface ConfigState {
    value: {
        SuggesticUserId: string,
        SuggesticAPIKey: string
    }
}

const initialState: ConfigState = {
    value: {
        SuggesticUserId: "",
        SuggesticAPIKey: ""
}};

export const ConfigSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        fetchConfig: state => {
            state.value = {
                "SuggesticUserId": "I just performed API call to get SuggesticUserId",
                "SuggesticAPIKey": "I just performed API call to get SuggesticAPIKey"
            }           
        }       
    }
});

export const { fetchConfig } = ConfigSlice.actions;
export const getConfig = (state : RootState) => state.config.value;
export default ConfigSlice.reducer;