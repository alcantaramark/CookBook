import { gql } from "graphql-request";
import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { Recipe, RecipeSearch } from '../../../types/App_Types';
import { RootState } from "app/Redux/Store";
import Config from 'react-native-config';

interface GetRecipeByIdResponse{
    recipe: Recipe 
}

interface GetRecipesByTagResponse{
    recipesByTag: RecipeSearch
}

interface GetPopularRecipesResponse{
    popularRecipes: RecipeSearch
}

export const recipeApi = createApi({
    reducerPath: "reducerApi",
    baseQuery: graphqlRequestBaseQuery({
        url: Config.SUGGESTIC_URL,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState
            headers.set('Content-Type', "application/json");
            headers.set('sg-user', state.apiConfig.config.suggesticUserId);
            headers.set('Authorization', `Token ${state.apiConfig.config.suggesticAPIKey}`);
            return headers;
        },
        customErrors: (error) => "error getting recipe details"
    }),
    endpoints: (builder) => ({
      getRecipeById: builder.query<Recipe, string>({
        query: (recipeId: string) => ({
            document: gql `query Search($id: ID!){
                recipe(id: $id){
                    id
                    mainImage
                    name
                    totalTime
                    numberOfServings
                    ingredientLines
                    instructions
                }
            }`,
            variables: {
                id: recipeId
            }
        }),
        transformResponse: (response: GetRecipeByIdResponse) => response.recipe
      }),
      getRecipesByTag: builder.query<RecipeSearch, {tag: string, recordPerPage: Number, endCursor: string}>({
        serializeQueryArgs: ( { endpointName } ) => {
            return endpointName;
        },
        merge: (currentCache, newItems) => {
            currentCache.edges.push(...newItems.edges.filter(x => !currentCache.edges.some(c => c.node.id === x.node.id)));
            currentCache.pageInfo = newItems.pageInfo;
        },
        forceRefetch: ({ currentArg, previousArg }) => {
            return !(JSON.stringify(currentArg) === JSON.stringify(previousArg));
        },
        query: ({tag, recordPerPage, endCursor}) => ({
            document: gql `query Search($tag: String = "", $recordPerPage: Int = 20, endCursor: String = ""){
                recipesByTag(tag: $tag
                after: $endCursor
                first: $recordPerPage){
                    edges{
                        node{
                            id
                            name
                            mainImage
                            totalTime
                        }
                        cursor
                    }
                    pageInfo{
                        startCursor
                        endCursor
                        hasPreviousPage
                        hasNextPage
                    }
                },
            }`,
            variables: {
                tag, 
                recordPerPage,
                endCursor
            }
        }),
        transformResponse: (response: GetRecipesByTagResponse) => response.recipesByTag
      }),
      getPopularRecipes: builder.query<RecipeSearch, {recordPerPage: Number, endCursor: string}>({
        serializeQueryArgs: ( { endpointName } ) => {
            return endpointName;
        },
        merge: (currentCache, newItems) => {
            currentCache.edges.push(...newItems.edges.filter(x => !currentCache.edges.some(c => c.node.id === x.node.id)));
            currentCache.pageInfo = newItems.pageInfo;
        },
        forceRefetch: ({ currentArg, previousArg }) => {
            return !(JSON.stringify(currentArg) === JSON.stringify(previousArg));
        },
        query: ({recordPerPage, endCursor}) => ({
            document: gql `query Search($recordPerPage: Int = 20, endCursor: String = ""){
                popularRecipes(after: $endCursor
                first: $recordPerPage){
                    edges{
                        node{
                            id
                            name
                            mainImage
                            totalTime
                        }
                        cursor
                    }
                    pageInfo{
                        startCursor
                        endCursor
                        hasPreviousPage
                        hasNextPage
                    }
                },
            }`,
            variables: {
                recordPerPage,
                endCursor
            }
        }),
        transformResponse: (response: GetPopularRecipesResponse) => response.popularRecipes
      })
    })
});

export const { useGetRecipeByIdQuery, useGetPopularRecipesQuery, useGetRecipesByTagQuery } = recipeApi;