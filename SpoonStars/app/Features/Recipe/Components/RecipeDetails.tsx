import React, { FC } from 'react';
import { Text } from 'react-native-paper';
import { searchRecipeById, selectRecipeItem } from './../Scripts/RecipeSlice';
import { useAppDispatch, useAppSelector } from './../../../Redux/Hooks';
import { DetailsScreenProps } from './../../../../types/App_Types';




const RecipeDetails: FC<DetailsScreenProps> = ({route, navigation}: DetailsScreenProps) => {
  
  const dispatch = useAppDispatch();
  const recipeItem = useAppSelector(selectRecipeItem);
  
  const getRecipeDetails = async () => {
    await dispatch(searchRecipeById(''));
  }

  
  return (
    <Text>{route.params.id}</Text>
  )
}

export default RecipeDetails;
