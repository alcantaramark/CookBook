import { gql } from "graphql-request";
import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { Suggestions } from '../../../types/App_Types';
import { RootState } from "app/Redux/Store";
import Config from 'react-native-config';

interface SuggestRecipesResponse{
    recipeSearch: {
        edges: Suggestions[]
    }
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
        customErrors: () => "Error Handling Request"
    }),
    endpoints: (builder) => ({
        suggestRecipes: builder.query<Suggestions[], {
            query: string, recordPerPage: Number
        }>({
            query: ({query, recordPerPage}) => ({
                document: gql `query Search($query: String = "" $recordPerPage: Int = 20){
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
            transformResponse: (response: SuggestRecipesResponse) => response.recipeSearch.edges,
        }),
    }),
});

export const { useSuggestRecipesQuery } = searchApi;