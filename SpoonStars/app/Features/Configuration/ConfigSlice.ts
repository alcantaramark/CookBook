import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../Redux/Store";
import { fetchApiConfig } from "./ConfigService";

export interface ConfigState {
    config: {
        suggesticUserId: string,
        suggesticAPIKey: string
    },
    status: string
}

const initialState: ConfigState = {
    config: { 
        suggesticUserId: "",
        suggesticAPIKey: ""
    },
    status: "idle"
};

export const fetchConfig = createAsyncThunk('apiConfig/getApiConfig', async () => {
    const config = await fetchApiConfig().then(response => response.json());
    return config;
})

export const ConfigSlice = createSlice({
    name: "apiConfig",
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder.addCase(fetchConfig.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchConfig.fulfilled, (state, action) => {
            state.config = action.payload;
            state.status = "succceeded"
        });
    }
});

//export const recipeAPIConfig = (state : RootState) => state.apiConfig.config;
export const selectConfig = (state: RootState) => state.apiConfig.config;
export const selectStatus = (state: RootState) => state.apiConfig.status;
export default ConfigSlice.reducer;