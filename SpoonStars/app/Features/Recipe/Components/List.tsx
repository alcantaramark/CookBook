import React, { FC, useEffect } from 'react';
import { Text } from 'react-native-paper';
import { getPopular } from '../Services/Queries/SearchPopular';
import { useAppSelector } from '../../../Redux/Hooks';
import { recipeAPIConfig } from '../../../Features/Configuration/ConfigSlice';

interface ListProps {}

const List: FC<ListProps> = () => {
  const config = useAppSelector(recipeAPIConfig);

  useEffect(() => {
    console.log(config.suggesticUserId);
    getPopular(config.suggesticUserId, config.suggesticAPIKey).then(response => console.log(response))
  }, []);
  
  return(
    <>
      <Text>i am here { config.suggesticUserId }</Text>
      <Text>i am here{ config.suggesticAPIKey }</Text> 
    </>
  );
};

export default List;
