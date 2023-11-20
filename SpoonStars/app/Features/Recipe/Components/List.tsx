import React, { FC, useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';
import { selectConfig, selectConfigStatus } from '../../../Features/Configuration/ConfigSlice';
import { fetchPopularRecipes, selectRecipesStatus } from './../RecipeSlice';

interface ListProps {}

const List: FC<ListProps> = () => {
  const config = useAppSelector(selectConfig);
  const configStatus = useAppSelector(selectConfigStatus);
  const recipeStatus = useAppSelector(selectRecipesStatus);
  
  const dispatch = useAppDispatch();
  

  useEffect(() => {
    if (configStatus === "succeeded"){
      dispatch(fetchPopularRecipes({
        suggesticAPIKey: config.suggesticAPIKey,
        suggesticUserId: config.suggesticUserId
      }));
    }
  }, [config])
  
  if (recipeStatus == "loading") {
    return(
      <>
        <Text>fetching data...</Text>
      </>
    );
  }
  else {
    return(
      <>
        <Text>{ config.suggesticUserId }</Text>
        <Text>{ config.suggesticAPIKey }</Text> 
      </>
    );
  }
};

export default List;
