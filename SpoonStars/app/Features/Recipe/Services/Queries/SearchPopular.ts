import { SUGGESTIC_URL } from '@env'
import { store } from './../../../../Redux/Store';

export const searchPopular = async () => {
    const { suggesticUserId, suggesticAPIKey } = store.getState().apiConfig.config;

    return await fetch(SUGGESTIC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'sg-user': suggesticUserId,
                'Authorization': `Token ${suggesticAPIKey}`
            },
            body: JSON.stringify({
                query: `{
                    popularRecipes {
                        edges {
                            node {
                                id
                                name
                                mainImage
                                totalTime
                            }
                        }
                    }
                }`
            })
        });
}