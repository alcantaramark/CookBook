import React, { FC, Fragment } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import Header from '../Header/Header';
import { StyleSheet } from 'react-native';


interface HomeProps {}

const Home: FC<HomeProps> = () => (
  <Fragment>
    <Header title='Header Home'/>
    <SafeAreaView>
      <Text>
        Home Component
      </Text>
    </SafeAreaView>
  </Fragment>
);



export default Home;
