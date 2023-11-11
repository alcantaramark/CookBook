import React, { FC, useContext } from 'react';
import { Text } from 'react-native-paper';
import { HomeContext } from './Home';

interface HomeMainProps {}



const Main: FC<HomeMainProps> = () => {
  const { searchText } = useContext(HomeContext);

  return (
    <Text>
      {searchText}
    </Text>)
};

export default Main;
