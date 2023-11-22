import React, { FC, useEffect, ReactElement } from 'react';
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';
import { selectConfig } from '../../../Features/Configuration/ConfigSlice';
import { fetchPopularRecipes, selectRecipesStatus, selectRecipes, recipe } from './../RecipeSlice';
import View from './View';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';



interface ListProps {}


const List: FC<ListProps> = () => {
  const configState = useAppSelector(selectConfig);
  const recipeStatusState = useAppSelector(selectRecipesStatus);
  const recipesState: recipe[] = useAppSelector(selectRecipes);
  
  const dispatch = useAppDispatch();

  const renderItem = ({item}:{
    item: recipe;
    index?: number;
  }): ReactElement => {
    return (
      <View item={item}  />
    );
  };
  
  useEffect(() => {
    console.log('i am here');
    dispatch(fetchPopularRecipes());
  }, [configState])
  
  

  return(
    <GestureHandlerRootView>
      <FlatList
            keyExtractor = {(item: recipe): string => item.id}
            numColumns = {1}
            data= { recipesState }
            renderItem={renderItem}
            horizontal={false}
      />
    </GestureHandlerRootView>
  );
}

export default List;
