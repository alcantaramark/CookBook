import { NativeStackScreenProps } from "@react-navigation/native-stack";

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

export interface PageInfo{
    startCursor: string,
    endCursor: string,
    hasNextPage: boolean,
    hasPreviousPage: boolean
}

interface Suggestions {
    node: recipe,
    cursor: string
}

interface RecipeSearch{
    edges: Suggestions[],
    pageInfo: PageInfo
}

export type RootStackParamList = {
    Home: undefined;
    Details: { id: string };
    Search: undefined;
  };

 export type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;
 export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
 export type SearchScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
 
 export type StackNavigation = NavigationProp<RootStackParamList>;