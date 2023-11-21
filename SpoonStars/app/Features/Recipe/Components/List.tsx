import React, { FC, useEffect, ReactElement } from 'react';
import { Text } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';
import { selectConfig } from '../../../Features/Configuration/ConfigSlice';
import { fetchPopularRecipes, selectRecipesStatus, selectRecipes, recipe } from './../RecipeSlice';
import MasonryList from 'reanimated-masonry-list';
import View from './View';

interface ListProps {}


const List: FC<ListProps> = () => {
  const configState = useAppSelector(selectConfig);
  const recipeStatusState = useAppSelector(selectRecipesStatus);
  const recipesState = useAppSelector(selectRecipes);
  
  const dispatch = useAppDispatch();

  const renderItem = ({
    item
  }: {
    item: any;
    index?: number;
  }): ReactElement => {
    return <View item={item} />;
  };


  useEffect(() => {
    console.log('i am here');
    dispatch(fetchPopularRecipes());
  }, [configState])
  
  

  return(
    <>
      { 
        recipeStatusState === "loading" ?  <Text>Fetching Data...</Text> : 
        <MasonryList
          keyExtractor={(item: recipe): string => item.id}
          contentContainerStyle={{
            paddingHorizontal: 24,
            alignSelf: 'stretch',
          }}
          numColumns = {2}
          data = { recipesState  }
          renderItem = {renderItem}
        /> 
      }
    </>
  );

  // if (recipeStatus == "loading") {
  //   return(
  //     <>
  //       <Text>fetching data...</Text>
  //     </>
  //   );
  // }
  // else {
  //   return(
  //     <>
  //       <Text>{ config.suggesticUserId }</Text>
  //       <Text>{ config.suggesticAPIKey }</Text> 
  //     </>
  //   );
  // }
};

export default List;
