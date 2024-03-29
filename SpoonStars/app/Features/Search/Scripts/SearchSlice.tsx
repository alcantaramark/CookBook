import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../Redux/Store";
import { PageInfo, Recipe } from "types/App_Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SuggestRecipes from "../Services/Queries/SuggestRecipes";


export interface searchState {
    suggestions: suggestionsPayload[],
    searchHistory: string[],
    keywords: string,
    status: string,
    historyStatus: string,
    errors: string,
    pagination: PageInfo,
    showFullResults: boolean,
    searchBy: string,
    searchText: string,
    showListResults: boolean,
    isSearching: boolean;
    recordPerPage: Number
}

export interface suggestionsPayload {
    node: Recipe,
    cursor: string
}

interface searchQueriesName{
    name: string,
    searchAll: boolean
}

interface searchQueriesIngredients{
    ingredients: string[],
    searchAll: boolean
}

const initialState: searchState = {
    suggestions: new Array<suggestionsPayload>,
    searchHistory: new Array<string>,
    keywords: '',
    status: 'idle',
    historyStatus: 'idle',
    errors: '',
    pagination: {
        startCursor: '',
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false
    },
    showFullResults: false,
    searchBy: 'name',
    searchText: '',
    showListResults: false,
    isSearching: false,
    recordPerPage: 50
}

export const saveSearchHistory = createAsyncThunk('search/saveSearchHistory', async (keyword: string, { rejectWithValue }) => {
    const searchHistory = await AsyncStorage.getItem('search-history');
    let keywords: string[] = new Array();
    
    try{
        if (keyword == null || keyword === '')
            return;

        if (searchHistory !== null){
            keywords = searchHistory.split('\n');
            if (keywords.find(s => s === keyword) === undefined) {
                keywords.push(keyword);
            }
        }
        else {
            keywords.push(keyword);
        }

        await AsyncStorage.setItem('search-history', keywords.join('\n'));
    }
    catch(e){
        return rejectWithValue('error saving search history');
    }
})

export const fetchSearchHistory = createAsyncThunk('search/fetchSearchHistory', async(text: string, { fulfillWithValue, rejectWithValue }) => {
    try {
        const searchHistory = await AsyncStorage.getItem('search-history');
        if (searchHistory === null){
            return fulfillWithValue(searchHistory);
        }
        else {
            const textArray = searchHistory.split('\n').filter(search => search.startsWith(text));
            return fulfillWithValue(textArray);
        }
    }
    catch(e){
        return rejectWithValue('error getting search history');
    }
});

export const clearHistory = createAsyncThunk('search/clearHistory', async () => {
    await AsyncStorage.removeItem('search-history');
});


export const suggestRecipesByName = createAsyncThunk('search/fetchRecipesByName', async (queries: searchQueriesName, 
    { rejectWithValue, fulfillWithValue }) => {
        const { name, searchAll } = queries;
        const { searchByName } = SuggestRecipes();

        try{
            const suggestions =  await searchByName(name, searchAll).then(response => response.json());
            
            return  fulfillWithValue(suggestions.data.recipeSearch);
        }
        catch(e) {
            return rejectWithValue('error fetching suggestions by name');
        }
});

export const suggestRecipesByIngredients = createAsyncThunk('search/fetchRecipesByIngredients', async (queries: searchQueriesIngredients
    , {rejectWithValue, fulfillWithValue}) => {
        const { ingredients, searchAll } = queries;
        const { searchByIngredients } = SuggestRecipes();

        try {
            const suggestions = await searchByIngredients(ingredients, searchAll).then(response => response.json());
            return fulfillWithValue(suggestions.data.searchRecipesByIngredients);
        }
        catch (e){
            return rejectWithValue('error fetching suggestions by ingredients');
        }
    }
);

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearPaging: state => {
            state.pagination = {
                startCursor: '',
                endCursor: '',
                hasNextPage: false,
                hasPreviousPage: false
            };
        },
        clearSuggestions: () => initialState,
        setShowFullResults: (state, action) => { 
            state.showFullResults = action.payload; 
        },
        setSearchBy: (state, action) => {
            state.searchBy = action.payload;
        },
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        setShowListResults: (state, action) => {
            state.showListResults = action.payload;
        },
        setIsSearching: (state, action) => {
            state.isSearching = action.payload;
        },
        setRecordPerPage: (state, action) =>  { 
            state.recordPerPage = action.payload
        },
        setSearchPageInfo: (state, action) =>  { 
            state.pagination = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(saveSearchHistory.pending, state => {
            state.historyStatus = 'loading';
            state.errors = ''
        }).addCase(saveSearchHistory.rejected, (state, action) => {
            if (state.historyStatus === 'loading') {
                state.historyStatus = 'idle';
                state.errors = action.payload as string;
            }
        }).addCase(saveSearchHistory.fulfilled, (state, action) => {
            state.historyStatus = 'succeeded';
        }).addCase(fetchSearchHistory.pending, state => {
            state.historyStatus = 'loading';
            state.errors = ''
        }).addCase(fetchSearchHistory.rejected, (state, action) => {
            if (state.historyStatus === 'loading') {
                state.historyStatus = 'idle';
                state.errors = action.payload as string;
            }            
        }).addCase(fetchSearchHistory.fulfilled, (state, action) => {
            if (action.payload !== null) {
                state.historyStatus = 'succeeded';
                state.searchHistory = action.payload!;
            }
        }).addCase(clearHistory.pending, state => {
            state.historyStatus = 'loading';
            state.errors = '';
        }).addCase(clearHistory.fulfilled, state => {
            state.searchHistory = [];
            state.historyStatus = 'succeeded';
        })
        .addCase(suggestRecipesByName.pending, state => {
            state.status = 'loading',
            state.errors = ''
        }).addCase(suggestRecipesByName.rejected, (state, action) => {
            if (state.status === 'loading') {
                state.status = 'idle';
                state.errors = action.payload as string;
            }
        }).addCase(suggestRecipesByName.fulfilled, (state, action) => {
            if (action.payload !== null){
                state.status = 'succeeded';
                if (!action.payload.pageInfo.hasPreviousPage) {
                    state.suggestions = [];
                }
                
                action.payload.edges.map((item: suggestionsPayload) => {
                    if (state.suggestions.findIndex(recipe => recipe.node.id === item.node.id) < 0){
                        state.suggestions.push(item);
                    }
                })

                state.pagination = action.payload.pageInfo;
                state.errors = '';
            }
            else {
                state.errors = `Error searching`
            }
            state.status = 'succeeded'
        }).addCase(suggestRecipesByIngredients.pending, state => {
            state.status = 'loading',
            state.errors = ''
        }).addCase(suggestRecipesByIngredients.rejected, (state, action) => {
            if (state.status === 'loading') {
                state.status = 'idle';
                state.errors = action.payload as string;
            }
        }).addCase(suggestRecipesByIngredients.fulfilled, (state, action) => {
            if (action.payload !== null){
                state.status = 'succeeded';
                
                if (!action.payload.pageInfo.hasPreviousPage) {
                    state.suggestions = [];
                }
                
                action.payload.edges.map((item: suggestionsPayload) => {
                    if (state.suggestions.findIndex(recipe => recipe.node.id === item.node.id) < 0){
                        state.suggestions.push(item);
                    }
                })
                state.pagination = action.payload.pageInfo;
                state.errors = '';
            }
            else{
                state.errors = `Error searching`
            }
            state.status = 'succeeded'
        });
    }
});

export const selectKeyWords = (state: RootState) => state.search.keywords;
export const selectSearchHistoryStatus = (state: RootState) => state.search.historyStatus;
export const selectSearchErrors = (state: RootState) => state.search.errors;
export const selectSearchPageInfo = (state: RootState) => state.search.pagination;
export const selectSearchHistory = (state: RootState) => state.search.searchHistory;
export const selectSearchStatus = (state: RootState) => state.search.status;
export const selectSearchSuggestions = (state: RootState) => state.search.suggestions;
export const selectShowFullResults = (state: RootState) => state.search.showFullResults;
export const selectSearchBy = (state: RootState) => state.search.searchBy;
export const selectSearchText = (state: RootState) => state.search.searchText;
export const selectShowListResults = (state: RootState) => state.search.showListResults;
export const selectIsSearching = (state: RootState) => state.search.isSearching;
export const selectRecordPerPage = (state: RootState) => state.search.recordPerPage;

export const { clearSuggestions, setShowFullResults, clearPaging, 
    setSearchBy, setSearchText, setShowListResults, 
    setIsSearching, setRecordPerPage, setSearchPageInfo } = searchSlice.actions

    export default searchSlice.reducer;


