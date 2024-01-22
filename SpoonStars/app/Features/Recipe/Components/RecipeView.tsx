import React, {FC, useEffect} from 'react'
import { Card, Text } from 'react-native-paper'
import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { Recipe, RootStackParamList } from 'types/App_Types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';import CardContent from 'react-native-paper/lib/typescript/components/Card/CardContent';
;

export interface ReciepeViewProps {
    data: Recipe,
    navigation: NativeStackNavigationProp<RootStackParamList, "Details", undefined>
}



const { width } = Dimensions.get('window');
const IMG_HEIGHT = 250;

const RecipeView:FC<ReciepeViewProps> = ({data, navigation}) => {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
        }
    });

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                translateY: interpolate(
                    scrollOffset.value,
                    [-IMG_HEIGHT, 0, IMG_HEIGHT],
                    [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * .75]
                )
                },
                {
                    scale: interpolate(scrollOffset.value, 
                        [
                            -IMG_HEIGHT, 
                            0, 
                            IMG_HEIGHT
                        ],
                         [2, 1, 1]
                    )
                }
            ]
            };
        });

    

    const setupHeader = () => {
        navigation.setOptions({
            headerLeft: () => <MaterialCommunityIcons name='arrow-left-circle'  size={30} 
                onPress={() => navigation.pop() } style={{ opacity: .5 }} color={'white'}/>,
            headerBackground: () => <Animated.View  style={[styles.header, headerAnimatedStyle]}>
                <Animated.Image  source={{ uri: data!.mainImage }} style={{ height: 100, width: width, }} blurRadius={5} />
            </Animated.View>,
        })
    }
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
            <Card>
                <Card.Title title={data!.name} titleVariant='titleLarge'/>
                <Card.Content>
                    <Text variant='titleSmall'>Preparation Time: {data.totalTime}</Text>
                    <Text variant='titleSmall'>Number of Servings: {data.numberOfServings}</Text>
                    <View style={{marginTop: 10}}>
                        <Text variant='bodySmall'>{data.ingredientLines.join('\n')}</Text>
                        <Text variant='titleMedium'>Ingredients</Text>
                        <Text variant='bodySmall'>{data.ingredientLines.join('\n')}</Text>
                        <Text variant='titleMedium'>Instructions</Text>
                        <Text variant='bodySmall'>{data.instructions.join('\n')}</Text>
                    </View>
                </Card.Content>
            </Card>
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
     top: 10
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