import React, { FC } from 'react';
import { recipe } from '../RecipeSlice';
import { Avatar, Card, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


interface RecipeItemProps { 
    item: recipe
};

const RecipeItem: FC<RecipeItemProps> = ({item}) => {
    return(
        <Card style={ styles.card }>
            <Card.Title titleVariant='titleMedium' title = { item.node.name } />
            <Card.Cover style={styles.cardCover} source={{ uri: item.node.mainImage }} />
            <Card.Content>
                <View style={ styles.contentView }>
                    <MaterialCommunityIcons style={styles.cardIcons} name="clock-time-three-outline" size={20} />
                    <Text variant='titleSmall'>{ item.node.totalTime }</Text>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 5,
        borderRadius: 0
    },
    cardCover: {
        borderRadius: 0
    },
    cardIcons: {
        marginRight: 5
    },
    contentView: {
        marginTop: 5,
        flexDirection: 'row'
    }
})

export default RecipeItem;
