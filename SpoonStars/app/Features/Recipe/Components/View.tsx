import React, { FC } from 'react';
import { recipe } from '../RecipeSlice';
import { Text } from 'react-native-paper';


interface ViewProps { 
    item: recipe
};

const View: FC<ViewProps> = ({item}) => {
    return(
        <>
            <Text>i{item.name}</Text>
        </>
    );
}

export default View;
