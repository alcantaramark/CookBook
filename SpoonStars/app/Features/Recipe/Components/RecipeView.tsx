import React, {FC} from 'react'
import { Text } from 'react-native-paper'
import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';

export interface ReciepeViewProps {
    data: any
}



const { width } = Dimensions.get('window');
const IMG_HEIGHT = 250;

const RecipeView:FC<ReciepeViewProps> = ({data}) => {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const imageAnimatedStyle = useAnimatedStyle(() => {
    
    return {
        transform: [
            {
            translateY: interpolate(
                0,
                [-IMG_HEIGHT, scrollOffset.value, IMG_HEIGHT],
                [-IMG_HEIGHT / 2, scrollOffset.value, IMG_HEIGHT * 0.75]
            )
            },
            {
                scale: interpolate(0, [-IMG_HEIGHT, scrollOffset.value, IMG_HEIGHT], [2, 1, 1])
            }
        ]
        };
    });
    
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
  return (
    <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
            <Animated.Image
              source={{ uri: data!.mainImage }}
              style={[styles.image, imageAnimatedStyle]}
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
    </Animated.ScrollView>
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

export default RecipeView