import React, { FC } from 'react';
import { Button } from 'react-native-paper';
import { DetailsScreenProps } from './../../../../types/App_Types';
import { useGetRecipeByIdQuery } from '../../Api/RecipeApi';
import useErrorHandler from '../../Shared/Components/ErrorHandler';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import useLoading from '../../Shared/Components/Loading';
import RecipeView from './RecipeView';

const RecipeDetails: FC<DetailsScreenProps> = ({route, navigation}: DetailsScreenProps) => {
  const { data, error, isLoading } = useGetRecipeByIdQuery(route.params.id);
  const { showError } = useErrorHandler();
  const { RecipeDetailsLoader } = useLoading();
  
  
  const handleOnPress = () => {
    navigation.pop();
  }

  if (error !== undefined){
    return (showError(error as string))
  }

  if (isLoading) {
    return (RecipeDetailsLoader());
  }
  return (
    <View style={styles.container}>
      {/* <GestureHandlerRootView>
        <NativeViewGestureHandler>
          
        </NativeViewGestureHandler>
      </GestureHandlerRootView> */}
      <RecipeView data={data}/>
      <Button onPress={handleOnPress}>Go Back</Button>
    </View>
  )
}

const styles = StyleSheet.create({
 container: {
  flex: 1
 }
})

export default RecipeDetails;
