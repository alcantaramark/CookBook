import React, { FC, useEffect, ReactElement } from 'react';
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';
import { selectConfig, selectConfigStatus } from '../../Configuration/ConfigSlice';
import { selectRecipes, recipe, fetchPopularRecipes } from '../RecipeSlice';
import RecipeItem from './RecipeItem';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import RecipeHeader from './RecipeHeader';



interface RecipeMainProps {}


const RecipeMain: FC<RecipeMainProps> = () => {
  const recipesState: recipe[] = useAppSelector(selectRecipes);
  
  
  const renderItem = ({item}:{
    item: recipe;
    index?: number;
  }): ReactElement => {
    return (
      <RecipeItem item={item}  />
    );
  };
  
  const configState = useAppSelector(selectConfig);
  const configStatusState = useAppSelector(selectConfigStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (configStatusState === 'succeeded'){
      dispatch(fetchPopularRecipes());
    }
  }, [configState])
  
  const loadMore = async ()=> {
    dispatch(fetchPopularRecipes());
  }

  return(
    <>
      <RecipeHeader />
      <GestureHandlerRootView>
        <FlatList
              keyExtractor = {(item: recipe): string => item.node.id}
              numColumns = {1}
              data= { recipesState }
              renderItem={renderItem}
              horizontal={false}
              onEndReached={loadMore}
        />
      </GestureHandlerRootView>
    </>
  );
}

export default RecipeMain;
