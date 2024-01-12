import { gql } from "graphql-request";
import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { RecipeSearch } from '../../../types/App_Types';
import { RootState } from "app/Redux/Store";
import Config from 'react-native-config';

interface SuggestRecipesByNameResponse{
    recipeSearch: RecipeSearch
}

interface SuggestRecipesByIngredientsResponse{
    searchRecipesByIngredients: RecipeSearch
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
        customErrors: (error) => error.message
    }),
    endpoints: (builder) => ({
        suggestRecipesByIngredients: builder.query<RecipeSearch, { ingredients: string[], recordPerPage: Number, endCursor: string}>({
            serializeQueryArgs: ( { endpointName } ) => {
                return endpointName;
            },
            merge: (currentCache, newItems) => {
                currentCache.edges.push(...newItems.edges.filter(x => !currentCache.edges.some(c => c.node.id === x.node.id)));
                currentCache.pageInfo = newItems.pageInfo;
            },
            forceRefetch: ({ currentArg, previousArg }) => { 
                return currentArg !== previousArg 
            },
            query: ({ingredients, recordPerPage, endCursor}) => ({
                document: gql `query Search($query: [String!]!, $recordPerPage: Int = 20, $endCursor: String = ""){
                    searchRecipesByIngredients(mustIngredients: $query
                        first: $recordPerPage
                        after: $endCursor){
                        edges{
                            node{
                                name
                                id
                                mainImage        
                            }
                            cursor
                        }
                        pageInfo{
                            startCursor
                            endCursor
                            hasPreviousPage
                            hasNextPage
                        }
                    }
                }`,
                variables: {
                    query: ingredients, 
                    recordPerPage,
                    endCursor
                }
            }),
            transformResponse: (response: SuggestRecipesByIngredientsResponse) => response.searchRecipesByIngredients,
        }),
        suggestRecipesByName: builder.query<RecipeSearch, { query: string, recordPerPage: Number, endCursor: string}>({
            serializeQueryArgs: ( { endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems) => {
                currentCache.edges.push(...newItems.edges.filter(x => !currentCache.edges.some(c => c.node.id === x.node.id)));
                currentCache.pageInfo = newItems.pageInfo;
            },
            forceRefetch: ({ currentArg, previousArg }) => { 
                return currentArg !== previousArg 
            },
            query: ({query, recordPerPage, endCursor}) => ({
                document: gql `query Search($query: String = "", $recordPerPage: Int = 20, $endCursor: String = ""){
                    recipeSearch(query: $query
                        first: $recordPerPage
                        after: $endCursor){
                        edges{
                            node{
                                name
                                id
                                mainImage        
                            }
                            cursor
                        }
                        pageInfo{
                            startCursor
                            endCursor
                            hasPreviousPage
                            hasNextPage
                        }
                    }
                }`,
                variables: {
                    query, 
                    recordPerPage,
                    endCursor
                }
            }),
            transformResponse: (response: SuggestRecipesByNameResponse) => response.recipeSearch,
        }),
    })
});

export const { useSuggestRecipesByNameQuery, useSuggestRecipesByIngredientsQuery } = searchApi;