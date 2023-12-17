import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../Redux/Store";
import { fetchApiConfig } from "./ConfigService";

export interface ConfigState {
    config: {
        suggesticUserId: string,
        suggesticAPIKey: string
    },
    status: string,
    errors: string
}

const initialState: ConfigState = {
    config: { 
        suggesticUserId: "",
        suggesticAPIKey: ""
    },
    status: "idle",
    errors: ""
};

export const fetchConfig = createAsyncThunk('apiConfig/getApiConfig', async (_, { rejectWithValue, fulfillWithValue }) => {
    try{
        const config = await fetchApiConfig().then(response => response.json());
        return fulfillWithValue(config);
    }
    catch(e){
        return rejectWithValue('Error fetching config');
    }
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
            state.status = "succeeded"
        })
        .addCase(fetchConfig.rejected, (state, action) => {
          if (state.status === 'loading'){
            state.status = 'idle'
            state.errors = action.payload as string
          }
        });
    }
});

export const selectConfig = (state: RootState) => state.apiConfig.config;
export const selectConfigStatus = (state: RootState) => state.apiConfig.status;
export const selectConfigError = (state: RootState) => state.apiConfig.errors;
export default ConfigSlice.reducer;