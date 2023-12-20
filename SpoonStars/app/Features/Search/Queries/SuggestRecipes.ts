import Config from 'react-native-config';
import { store } from './../../../Redux/Store';

export const searchByName = async (name: string, searchAll?:boolean) => {
    if (searchAll !== undefined && !searchAll){
        return await searchByNamePartial(name);
    }
    return await searchByNamePartial(name);
}

export const searchByIngredients = async (ingredients: string[], searchAll?:boolean) => {
    console.log('i am here in search by ingredients');
    if (searchAll !== undefined && !searchAll){
        return await searchByIngredientsPartial(ingredients);
    }
    return await searchByIngredientsPartial(ingredients);
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
        body: JSON.stringify({
            query: `{
            recipeSearch(query: \"${name}\" first: 5) {
                edges {
                    node {
                        name
                        id
                        mainImage
                    }
                    cursor
                }
            }
        }`})
    });
}

const searchByIngredientsPartial = async (ingredients: string[]) => {
    const { suggesticUserId, suggesticAPIKey } = store.getState().apiConfig.config;

    const ingredientsKeywords =  ingredients.map(item => `"${item}"`).join(',');
    
    return await fetch(Config.SUGGESTIC_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'sg-user': suggesticUserId,
            'Authorization': `Token ${suggesticAPIKey}`
        },
        body: JSON.stringify({
            query: `{
            searchRecipesByIngredients( mustIngredients: [${ingredientsKeywords}] first: 5) {
                edges {
                    node {
                        name
                        id
                        mainImage
                    }
                    cursor
                }
            }
            }`
        })  
    })
}