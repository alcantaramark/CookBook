export interface recipe{
    id: string,
    name: string,
    mainImage: string,
    totalTime: string
}

export interface recipeTag{
    name: string,
    preferred: boolean
}

export interface pageInfo{
    startCursor: string,
    endCursor: string,
    hasNextPage: boolean,
    hasPreviousPage: boolean
}