import { useAppSelector } from "../../../Redux/Hooks";
import { selectSearchBy, selectSearchText } from "./SearchSlice";
import { useSuggestRecipesByNameQuery, useSuggestRecipesByIngredientsQuery } from '../../Api/SearchApi';


const useSearch = (recordPerPage: number, lastRecord: string) => {
    const searchBy = useAppSelector(selectSearchBy);
    const searchText = useAppSelector(selectSearchText);

    
    if (searchBy === 'name'){
        return useSuggestRecipesByNameQuery({
            query: searchText,
            recordPerPage: recordPerPage,
            endCursor: lastRecord
        })
    }else {
        console.log('searching by ingredients');
        return useSuggestRecipesByIngredientsQuery({
            query: searchText.split(' '),
            recordPerPage: recordPerPage,
            endCursor: lastRecord
        })
    }
}

export default useSearch;