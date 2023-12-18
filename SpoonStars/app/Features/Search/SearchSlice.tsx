import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../Redux/Store";
import { pageInfo, recipe } from "types/App_Types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface searchState {
    suggestions: recipe[],
    searchHistory: string[],
    keywords: string,
    status: string,
    errors: string,
    pagination: pageInfo
}

const initialState: searchState = {
    suggestions: new Array<recipe>,
    searchHistory: new Array<string>,
    keywords: '',
    status: 'idle',
    errors: '',
    pagination: {
        startCursor: '',
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false
    }
}

export const saveSearchHistory = createAsyncThunk('search/saveSearchHistory', async (keyword: string, { rejectWithValue }) => {
    const searchHistory = await AsyncStorage.getItem('search-history');
    let keywords: string[] = new Array();

    try{
        if (searchHistory !== null){
            keywords = JSON.parse(searchHistory);
            keywords.push(keyword);
        }
        else {
            keywords.push(keyword);
        }

        await AsyncStorage.setItem('search-history', JSON.stringify(keywords));
    }
    catch(e){
        return rejectWithValue('error saving search history');
    }
})

export const fetchSearchHistory = createAsyncThunk('search/fetchSearchHistory', async(_, { fulfillWithValue, rejectWithValue }) => {
    try {
        const searchHistory = await AsyncStorage.getItem('search-history');
        return fulfillWithValue(searchHistory);
    }
    catch(e){
        return rejectWithValue('error getting search history');
    }
});

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(saveSearchHistory.pending, state => {
            state.status = 'loading';
            state.errors = ''
        }).addCase(saveSearchHistory.rejected, (state, action) => {
            if (state.status === 'loading') {
                state.status = 'idle';
                state.errors = action.payload as string;
            }
        }).addCase(saveSearchHistory.fulfilled, (state, action) => {
            state.status = 'succeeded';
        }).addCase(fetchSearchHistory.pending, state => {
            state.status = 'loading';
            state.errors = ''
        }).addCase(fetchSearchHistory.rejected, (state, action) => {
            if (state.status === 'loading') {
                state.status = 'idle';
                state.errors = action.payload as string;
            }            
        }).addCase(saveSearchHistory.fulfilled, (state, action) => {
            state.status = 'succeeded';

            if (action.payload !== undefined) {
                state.searchHistory = JSON.parse(action.payload as string);
            }
        });
    }
});

export const selectKeyWords = (state: RootState) => state.search.keywords;
export const selectSearchStatus = (state: RootState) => state.search.status;
export const selectSearchErrors = (state: RootState) => state.search.errors;
export const selectSearchPageInfo = (state: RootState) => state.search.pagination;
export const selectSearchHistory = (state: RootState) => state.search.searchHistory;
export default searchSlice.reducer;


