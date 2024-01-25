import { useAppSelector } from "../../../Redux/Hooks";
import { useGetPopularRecipesQuery, useGetRecipesByTagQuery } from "./../../Api/RecipeApi";
import { selectRecipeTags, selectRecordPerPage, selectRecipesPageInfo } from "./RecipeSlice";

const useFeed = () => {
    const recipeTags = useAppSelector(selectRecipeTags);
    const recordPerPage = useAppSelector(selectRecordPerPage);
    const recipesPageInfo = useAppSelector(selectRecipesPageInfo);
    const preferred = recipeTags.find(tag => tag.preferred == true);

    if (preferred === undefined){
        return useGetPopularRecipesQuery({
            recordPerPage: recordPerPage,
            endCursor: recipesPageInfo.endCursor
        });
    }
    else {
        return useGetRecipesByTagQuery({
            tag: preferred.name,
            recordPerPage: recordPerPage,
            endCursor: recipesPageInfo.endCursor
        })        
    }
}

export default useFeed;

