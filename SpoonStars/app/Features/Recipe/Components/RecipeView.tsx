import React, {FC, useEffect} from 'react'
import { Text } from 'react-native-paper'
import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { Recipe, RootStackParamList } from 'types/App_Types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

export interface ReciepeViewProps {
    data: Recipe,
    navigation: NativeStackNavigationProp<RootStackParamList, "Details", undefined>
}



const { width } = Dimensions.get('window');
const IMG_HEIGHT = 250;

const RecipeView:FC<ReciepeViewProps> = ({data, navigation}) => {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const setupHeader = () => {
        navigation.setOptions({
            headerBackground: () => <Animated.View  style={[styles.header, headerAnimatedStyle]} />,
            headerLeft: () => <Text>Back</Text>,
            headerTransparent: true
        })
    }


    const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
        transform: [
            {
            translateY: interpolate(
                0,
                [-IMG_HEIGHT, 0, IMG_HEIGHT],
                [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
            )
            },
            {
                scale: interpolate(0, 
                    [
                        -IMG_HEIGHT, 
                        scrollOffset.value, 
                        IMG_HEIGHT
                    ],
                     [2, 1, 1]
                )
            }
        ]
        };
    });
    
    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, 300 / 1.5], [0, 1])
        }
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

  useEffect(() => {
    setupHeader();
  }, [])
  
  return (
    <View>
    <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.Image
            source={{ uri: data!.mainImage }}
            style={[styles.image, imageAnimatedStyle]}
        />
        <View style={styles.recipeDetails}>
            <Text>Parallax Scroll</Text>
            {/* <View style={styles.recipePreparationTime}>
                <Text>Preparation Time: {data!.totalTime}</Text>
            </View>
            <View style={styles.recipeIngredients}>
                <Text>Ingredients</Text>
                { displayIngredients() }
            </View>
            <View style={styles.recipeDirections}>
                <Text>Cooking Instructions</Text>
                { displayInstructions() }
            </View> */}
        </View>
    </Animated.ScrollView>
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
     height: 1000,
     width: width,
    },
    recipeIngredients:{
   
    },
    recipeDirections:{
     marginTop: 10
    },
    recipePreparationTime:{
     marginTop: 10
    },
    header: {
        backgroundColor: '#fff',
        height: 100,
        borderWidth: StyleSheet.hairlineWidth
    }
   })

export default RecipeView