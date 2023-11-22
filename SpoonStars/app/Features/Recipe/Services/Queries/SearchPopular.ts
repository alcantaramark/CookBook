import { SUGGESTIC_URL } from '@env'
export const searchPopular = async (userId: string, apiKey: string) => {
    return await fetch(SUGGESTIC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'sg-user': '263f1333-2322-4dc7-bd8a-c0722f4f0e98',
                'Authorization': '7d675f0679ba1518ff95c0519e1db46fc79e9986'
            },
            body: JSON.stringify({
                query: `{
                    popularRecipes {
                        edges {
                            node {
                                id
                                name
                            }
                        }
                    }
                }`
            })
        });
}