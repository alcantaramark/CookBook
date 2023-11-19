import React, { FC, useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { getPopular } from '../Services/Queries/SearchPopular';
import { useAppSelector } from '../../../Redux/Hooks';
import { selectConfig, selectStatus } from '../../../Features/Configuration/ConfigSlice';

interface ListProps {}

const List: FC<ListProps> = () => {
  const config = useAppSelector(selectConfig);
  const status = useAppSelector(selectStatus);

  

  useEffect(() => {
    getPopular(config.suggesticAPIKey, config.suggesticUserId);
  }, [config])
  
  if (status == "loading") {
    return(
      <>
        <Text>fetching data...</Text>
      </>
    );
  }
  else {
    return(
      <>
        <Text>{ config.suggesticUserId }</Text>
        <Text>{ config.suggesticAPIKey }</Text> 
      </>
    );
  }
};

export default List;
