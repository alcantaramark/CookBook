import React, { FC, useEffect } from 'react';
import { Text, Button } from 'react-native-paper';
import { DetailsScreenProps } from './../../../../types/App_Types';
import { useGetRecipeByIdQuery } from '../../Api/RecipeApi';
import useErrorHandler from '../../Shared/Components/ErrorHandler';




const RecipeDetails: FC<DetailsScreenProps> = ({route, navigation}: DetailsScreenProps) => {
  const { data, error, isLoading } = useGetRecipeByIdQuery(route.params.id);
  const { showError } = useErrorHandler();
  
  const handleOnPress = () => {
    navigation.pop();
  }

  if (error !== undefined){
    return (<Text>{error as string}</Text>)
  }

  if (isLoading) {
    return (<Text>Loading...</Text>)
  }

  return (
    <>
      <Button onPress={handleOnPress}>Go Back</Button>
    </>
  )
}

export default RecipeDetails;
