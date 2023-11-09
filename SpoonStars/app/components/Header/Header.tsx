import React, { FC, createContext, useState } from 'react';
import { Text, Appbar, MD3LightTheme as defaultTheme, TextInput } from 'react-native-paper';
import { StyleSheet , View} from 'react-native';


interface HeaderProps {
  title: string
}

const Header: FC<HeaderProps> = (props) => {

 return(
  <View style={styles.container}>
    <Appbar.Header theme={theme} style={styles.header}>
      <TextInput placeholder='Search recipe...' style={ styles.textInput } />
    </Appbar.Header>
  </View>)
};

const theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow'
  }
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent'
  },
  container: {
    flex: 1
  },
  textInput: {
    width: '100%'
  }
})

export default Header;
