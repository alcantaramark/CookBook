import { useAppSelector } from "../../../Redux/Hooks";
import { selectSearchBy, selectSearchText } from "./SearchSlice";
import { useSuggestRecipesByNameQuery, useSuggestRecipesByIngredientsQuery } from '../../Api/SearchApi';


const useSearch = (recordPerPage: Number, lastRecord: string) => {
    const searchBy = useAppSelector(selectSearchBy);
    const searchText = useAppSelector(selectSearchText);

    if (searchBy === 'name'){
        return useSuggestRecipesByNameQuery({
            query: searchText,
            recordPerPage: recordPerPage,
            endCursor: lastRecord
        })
    }else {
        return useSuggestRecipesByIngredientsQuery({
            ingredients: searchText === '' ? [] :  searchText.split(' '),
            recordPerPage: recordPerPage,
            endCursor: lastRecord
        })
    }
}

export default useSearch;