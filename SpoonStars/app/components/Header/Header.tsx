import React, { FC, Fragment } from 'react';
import { Text, Appbar, MD3LightTheme as defaultTheme } from 'react-native-paper';
import App from '../../../App';
import { StyleSheet , View} from 'react-native';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';


interface HeaderProps {
  title: string
}

const Header: FC<HeaderProps> = (props) => (
  <View style={styles.container}>
    <Appbar.Header theme={theme} style={styles.header}>
      <Appbar.Content title={props.title} />
    </Appbar.Header>
  </View>
);

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
    backgroundColor: theme.colors.primary,
    opacity: 0.3
  },
  container: {
    flex: 1
  }
})

export default Header;
