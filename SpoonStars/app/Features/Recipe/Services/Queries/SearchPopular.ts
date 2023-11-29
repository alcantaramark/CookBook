import { SUGGESTIC_URL } from '@env'
import { store } from './../../../../Redux/Store';

export const searchPopular = async () => {
    const { suggesticUserId, suggesticAPIKey } = store.getState().apiConfig.config;
    const { endCursor, hasNextPage } = store.getState().recipe.pageInfo;

    return await fetch(SUGGESTIC_URL, {
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