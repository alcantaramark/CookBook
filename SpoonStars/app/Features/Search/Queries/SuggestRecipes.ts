import Config from 'react-native-config';
import { store } from './../../../Redux/Store';

export const searchByName = async (name: string, searchAll?:boolean) => {
    if (searchAll !== undefined && !searchAll){
        await searchByNamePartial(name);
    }
}

export const searchByIngredients = async (ingredients: string[], searchAll?:boolean) => {
    if (searchAll !== undefined && !searchAll){
        await searchByIngredientsPartial(ingredients);
    }
}

const searchByNamePartial = async (name: string) => {
    const { suggesticUserId, suggesticAPIKey } = store.getState().apiConfig.config;

    return await fetch(Config.SUGGESTIC_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'sg-user': suggesticUserId,
            'Authorization': `Token ${suggesticAPIKey}`
        },
        body: JSON.stringify(`{
            recipeSearch(query: \"${name}\" first: 5) {
                edges {
                    node {
                        name
                        id
                        image
                    }
                }
            }
        }`)
    });
}

const searchByIngredientsPartial = async (ingredients: string[]) => {
    const { suggesticUserId, suggesticAPIKey } = store.getState().apiConfig.config;

    const ingredientsKeywords =  ingredients.join(",");
    console.log('ingredients keywords', ingredientsKeywords);

    return await fetch(Config.SUGGESTIC_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'sg-user': suggesticUserId,
            'Authorization': `Token ${suggesticAPIKey}`
        },
        body: JSON.stringify(`{
            searchRecipesByIngredients( mustIngredients: [${ingredientsKeywords}] ) {
                edges {
                    nodes {
                        name
                        id
                        image
                    }
                }
            }
        }`)  
    })
}