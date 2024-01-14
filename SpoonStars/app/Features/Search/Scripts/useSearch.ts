import { useAppSelector } from "../../../Redux/Hooks";
import { selectSearchBy, selectSearchText, selectRecordPerPage, selectSearchPageInfo } from "./SearchSlice";
import { useSuggestRecipesByNameQuery, useSuggestRecipesByIngredientsQuery } from '../../Api/SearchApi';


const useSearch = () => {
    const searchBy = useAppSelector(selectSearchBy);
    const searchText = useAppSelector(selectSearchText);
    const recordPerPage = useAppSelector(selectRecordPerPage);
    const searchPageInfo = useAppSelector(selectSearchPageInfo);

    if (searchBy === 'name'){
        return useSuggestRecipesByNameQuery({
            query: searchText,
            recordPerPage: recordPerPage,
            endCursor: searchPageInfo.endCursor
        })
    }else {
        return useSuggestRecipesByIngredientsQuery({
            ingredients: searchText === '' ? [] :  searchText.split(' '),
            recordPerPage: recordPerPage,
            endCursor: searchPageInfo.endCursor
        })
    }
}

export default useSearch;