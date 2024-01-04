import { useAppDispatch, useAppSelector } from "../../../Redux/Hooks";
import { suggestRecipesByName, suggestRecipesByIngredients, selectSearchBy, setSearchText } from "./SearchSlice";


const Search = () => {
    const dispatch = useAppDispatch();
    const searchBy = useAppSelector(selectSearchBy);

    const search = async (all: boolean, query?: string) => {
        if (searchBy === 'name') {
            dispatch(suggestRecipesByName({ name: query == undefined || query === '' ? '': query, searchAll: all }));
        }
        else {
            dispatch(suggestRecipesByIngredients({
              ingredients: query == undefined || query === '' ?  []: query.split(' '),
              searchAll: all
            }));
        }
        dispatch(setSearchText(query === undefined ? '' : query));
    }
    return { search };
}

export default Search;