import { gql } from "graphql-request";
import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import { Recipe } from '../../../types/App_Types';
import { RootState } from "app/Redux/Store";
import Config from 'react-native-config';

interface GetRecipeByIdResponse{
    recipe: Recipe
}

export const recipeApi = createApi({
    baseQuery: graphqlRequestBaseQuery({
        url: Config.SUGGESTIC_URL,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState
            console.log('state config', state.apiConfig.config.suggesticAPIKey);
            headers.set('Content-Type', "application/json");
            headers.set('sg-user', state.apiConfig.config.suggesticUserId);
            headers.set('Authorization', `Token ${state.apiConfig.config.suggesticAPIKey}`);
            return headers;
        },
        customErrors: (error) => error.message  
    }),
    endpoints: (builder) => ({
      getRecipeById: builder.query<Recipe, string>({
        serializeQueryArgs: ( { endpointName } ) => {
            return endpointName;
        },
        merge: (currentCache, newItems) => {
            // currentCache.edges.push(...newItems.edges.filter(x => !currentCache.edges.some(c => c.node.id === x.node.id)));
            // currentCache.pageInfo = newItems.pageInfo;
        },
        forceRefetch: ({ currentArg, previousArg }) => {
            return !(JSON.stringify(currentArg) === JSON.stringify(previousArg));
        },
        query: (recipeId: string) => ({
            document: gql `query Search($id: ID!){
                recipe(id: $id){
                    mainImage
                    name
                }
            }`,
            variables: {
                id: recipeId
            }
        })
      })
    })
});

export const { useGetRecipeByIdQuery } = recipeApi;