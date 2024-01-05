import React, { FC } from 'react';
import { recipePayload } from '../Scripts/RecipeSlice';
import { Card } from 'react-native-paper';
import { StyleSheet } from 'react-native';


interface RecipeItemProps { 
    item: recipePayload
};

const RecipeItem: FC<RecipeItemProps> = ({item}) => {
    return(
        <Card style={ styles.card }>
            <Card.Cover style={styles.cardCover} source={{ uri: item.node.mainImage }} />
            <Card.Title titleVariant='titleMedium' title={ item.node.name } subtitle={ item.node.totalTime } />
        </Card>
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
