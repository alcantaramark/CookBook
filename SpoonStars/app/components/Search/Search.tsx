import React, { FC, Fragment } from 'react';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header/Header';

interface SearchProps {}

const Search: FC<SearchProps> = () => (
  <Fragment>
    <Header title='Header Search'/>
    <SafeAreaView>
      <Text>
        Search Component
      </Text>
    </SafeAreaView>
  </Fragment>
);

export default Search;
