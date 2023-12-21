import Config from 'react-native-config';
import { store } from '../../../../Redux/Store';

export const searchByName = async (name: string, searchAll:boolean) => {
    if (searchAll){
        return await searchByNameFull(name);
    }

    return await searchByNamePartial(name);
}

export const searchByIngredients = async (ingredients: string[], searchAll:boolean) => {
    if (searchAll){
        return await searchByIngredientsFull(ingredients);
    }
    return await searchByIngredientsPartial(ingredients);
}

const searchByNameFull = async (name: string) => {
    const { suggesticUserId, suggesticAPIKey } = store.getState().apiConfig.config;
    const { endCursor } = store.getState().search.pagination;
    
    
    return await fetch(Config.SUGGESTIC_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'sg-user': suggesticUserId,
            'Authorization': `Token ${suggesticAPIKey}`
        },
        body: JSON.stringify({
            query: `{
                recipeSearch(query: \"${name}\" 
                        first: 10
                        ${endCursor !== '' ? 'after: \"' + endCursor + '\"' : ''}
                    ) {
                    edges {
                        node {
                            name
                            id
                            mainImage
                        }
                        cursor
                    }

                    pageInfo {
                        startCursor
                        endCursor
                        hasPreviousPage
                        hasNextPage
                    }
                } 
            }`
        })
    });
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
                pageInfo {
                    startCursor
                    endCursor
                    hasPreviousPage
                    hasNextPage
                }
            }
        }`})
    });
}

const searchByIngredientsFull = async (ingredients: string[]) => {
    const { suggesticUserId, suggesticAPIKey } = store.getState().apiConfig.config;
    const { endCursor } = store.getState().search.pagination;

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
            searchRecipesByIngredients( mustIngredients: [${ingredientsKeywords}] 
                first: 10
                ${endCursor !== '' ? 'after: \"' + endCursor + '\"' : ''}
                ) {
                edges {
                    node {
                        name
                        id
                        mainImage
                    }
                    cursor
                }
                pageInfo {
                    startCursor
                    endCursor
                    hasPreviousPage
                    hasNextPage
                }                
            }
            }`
        })  
    })
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
                pageInfo {
                    startCursor
                    endCursor
                    hasPreviousPage
                    hasNextPage
                }
            }
            }`
        })  
    })
}