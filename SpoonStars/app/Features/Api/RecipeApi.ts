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
        customErrors: (error) => error.message  
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
      })
    })
});

export const { useGetRecipeByIdQuery } = recipeApi;