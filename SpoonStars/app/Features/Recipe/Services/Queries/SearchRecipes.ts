import Config from 'react-native-config';
import { store } from '../../../../Redux/Store';

export const searchByTag = async (tag: string) => {
    const { suggesticUserId, suggesticAPIKey } = store.getState().apiConfig.config;
    const { endCursor } = store.getState().recipe.pagination;
    return await fetch(Config.SUGGESTIC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'sg-user': suggesticUserId,
                'Authorization': `Token ${suggesticAPIKey}`
            },
            body: JSON.stringify({
                query: `{
                    recipesByTag(
                        tag: "${tag}"
                        first: 10
                        ${endCursor !== '' ? 'after: \"' + endCursor + '\"' : ''}
                        ) {
                        edges {
                            node {
                                id
                                name
                                mainImage
                                totalTime
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


export const searchPopular = async () => {
    const { suggesticUserId, suggesticAPIKey } = store.getState().apiConfig.config;
    const { endCursor } = store.getState().recipe.pagination;

    return await fetch(Config.SUGGESTIC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'sg-user': suggesticUserId,
                'Authorization': `Token ${suggesticAPIKey}`
            },
            body: JSON.stringify({
                query: `{
                    popularRecipes(
                        first: 10
                        ${endCursor !== '' ? 'after: \"' + endCursor + '\"' : ''}
                        ) {
                        edges {
                            node {
                                id
                                name
                                mainImage
                                totalTime
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