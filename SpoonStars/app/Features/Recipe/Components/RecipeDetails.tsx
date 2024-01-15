import React, { FC } from 'react';
import { Text, Button } from 'react-native-paper';
import { searchRecipeById, selectRecipeItem } from './../Scripts/RecipeSlice';
import { useAppDispatch, useAppSelector } from './../../../Redux/Hooks';
import { DetailsScreenProps } from './../../../../types/App_Types';




const RecipeDetails: FC<DetailsScreenProps> = ({route, navigation}: DetailsScreenProps) => {
  
  const dispatch = useAppDispatch();
  const recipeItem = useAppSelector(selectRecipeItem);
  
  const getRecipeDetails = async () => {
    await dispatch(searchRecipeById(''));
  }

  const handleOnPress = () => {
    navigation.pop();
  }

  return (
    <>
      <Button onPress={handleOnPress}>Go Back</Button>
      <Text>{route.params.id}</Text>
    </>
  )
}

export default RecipeDetails;
