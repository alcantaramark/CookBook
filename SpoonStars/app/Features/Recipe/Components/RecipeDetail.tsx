import React, { FC } from 'react';
import { recipe } from '../RecipeSlice';
import { Text } from 'react-native-paper';


interface RecipeDetailProps { 
    item: recipe
};

const RecipeDetail: FC<RecipeDetailProps> = ({item}) => {
    return(
        <>
            <Text>{item.node.name}</Text>
        </>
    );
}

export default RecipeDetail;
