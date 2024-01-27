import React, { FC } from 'react';
import { recipePayload } from '../Scripts/RecipeSlice';
import { Card } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { StackNavigation, Suggestions } from './../../../../types/App_Types';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface RecipeItemProps { 
    item: Suggestions
};

const RecipeItem: FC<RecipeItemProps> = ({item}) => {
    const { navigate } = useNavigation<StackNavigation>();

    const handleItemPress = () => {
        navigate('Details', {id: item.node.id});
    }

    return(
        <GestureHandlerRootView>
            <Card style={ styles.card } onPress={handleItemPress}>
                <Card.Cover style={styles.cardCover} source={{ uri: item.node.mainImage }} />
                <Card.Title titleVariant='titleMedium' title={ item.node.name } subtitle={ item.node.totalTime } />
            </Card>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        marginHorizontal: 10,
        elevation: 5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    cardCover: {
        borderRadius: 0,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
    },
    contentView: {
        marginTop: 0,
    }
})

export default RecipeItem;
