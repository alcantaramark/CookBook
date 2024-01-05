import React, { FC } from 'react';
import { Text } from 'react-native-paper';
import { searchRecipeById, selectRecipeItem } from './../Scripts/RecipeSlice';
import { useAppDispatch, useAppSelector } from './../../../Redux/Hooks';




const RecipeDetails = () => {
  
  const dispatch = useAppDispatch();
  const recipeItem = useAppSelector(selectRecipeItem);
  
  const getRecipeDetails = async () => {
    await dispatch(searchRecipeById(''));
  }

  getRecipeDetails
  return (
    <Text>Recipe Details</Text>
  )
}

export default RecipeDetails;
