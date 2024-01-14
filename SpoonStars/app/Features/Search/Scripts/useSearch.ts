import { useAppSelector } from "../../../Redux/Hooks";
import { selectSearchBy, selectSearchText, selectRecordPerPage } from "./SearchSlice";
import { useSuggestRecipesByNameQuery, useSuggestRecipesByIngredientsQuery } from '../../Api/SearchApi';


const useSearch = (lastRecord: string) => {
    const searchBy = useAppSelector(selectSearchBy);
    const searchText = useAppSelector(selectSearchText);
    const recordPerPage = useAppSelector(selectRecordPerPage);

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