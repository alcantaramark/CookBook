import React, { FC, useEffect } from 'react';
import { Text, Button } from 'react-native-paper';
import { DetailsScreenProps } from './../../../../types/App_Types';
import { useGetRecipeByIdQuery } from '../../Api/RecipeApi';
import useErrorHandler from '../../Shared/Components/ErrorHandler';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { GestureHandlerRootView, NativeViewGestureHandler, ScrollView } from 'react-native-gesture-handler';



const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const RecipeDetails: FC<DetailsScreenProps> = ({route, navigation}: DetailsScreenProps) => {
  const { data, error, isLoading } = useGetRecipeByIdQuery(route.params.id);
  const { showError } = useErrorHandler();
  
  const displayIngredients = () => {
    
    return(
      data!.ingredientLines.map((ingredient: string) => {
        return <Text>{ingredient}</Text>
      })
    )
  }

  const displayInstructions = () => {
    return(
     data!.instructions.map((instruction: string) => {
      return <Text>{instruction}</Text>
     })
    )
  }

  
  const handleOnPress = () => {
    navigation.pop();
  }

  if (error !== undefined){
    return (<Text>{error as string}</Text>)
  }

  if (isLoading) {
    return (<Text>Loading...</Text>);
  }

  

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <NativeViewGestureHandler>
          <ScrollView>
            <Image
              source={{ uri: data!.mainImage }}
              style={styles.image}
            />
            <View style={styles.recipeDetails}>
              <View style={styles.recipePreparationTime}>
                <Text>Preparation Time: {data!.totalTime}</Text>
              </View>
              <View style={styles.recipeIngredients}>
                <Text>Ingredients</Text>
                { displayIngredients() }
              </View>
              <View style={styles.recipeDirections}>
                <Text>Cooking Instructions</Text>
                { displayInstructions() }
              </View>
            </View>
            <Button onPress={handleOnPress}>Go Back</Button>
          </ScrollView>
        </NativeViewGestureHandler>
      </GestureHandlerRootView>
    </View>
  )
}

const styles = StyleSheet.create({
 container: {
  flex: 1
 },
 image: {
  width: width,
  height: IMG_HEIGHT
 },
 recipeDetails:{
  
 },
 recipeIngredients:{

 },
 recipeDirections:{
  marginTop: 10
 },
 recipePreparationTime:{
  marginTop: 10
 }
})

export default RecipeDetails;
