export interface recipe{
    id: string,
    name: string,
    mainImage: string,
    totalTime: string,
    numberOfServings: number,
    ingredientLines: Array<string>,
    instructions: Array<string>
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