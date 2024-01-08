import { gql } from "graphql-request";
import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { recipe } from '../../../types/App_Types';
import { RootState } from "app/Redux/Store";
import Config from 'react-native-config';

interface suggestRecipesResponse{
    recipeSearch: {
        edges: suggestionsPayload[]
    }
}

interface suggestionsPayload {
    node: recipe,
    cursor: string
}

export const searchApi = createApi({
    baseQuery: graphqlRequestBaseQuery({
        url: Config.SUGGESTIC_URL,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState
            headers.set('Content-Type', "application/json");
            headers.set('sg-user', state.apiConfig.config.suggesticUserId);
            headers.set('Authorization', `Token ${state.apiConfig.config.suggesticAPIKey}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        suggestRecipes: builder.query<suggestRecipesResponse, {
            query: string, recordPerPage: Number
        }>({
            query: ({query, recordPerPage}) => ({
                document: gql `query Search($query: String = "" $recordPerPage: Int = 10){
                    recipeSearch(query: $query
                        first: $recordPerPage ){
                        edges{
                            node{
                                name
                                id
                                mainImage        
                            }
                        }
                    }
                }`,
                variables: {
                    query, 
                    recordPerPage
                }
            }),
        }),
    }),
});

export const { useSuggestRecipesQuery } = searchApi;