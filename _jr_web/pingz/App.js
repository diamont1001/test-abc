/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {Platform, StyleSheet, ScrollView, SafeAreaView, View} from 'react-native';
import {createStackNavigator, createSwitchNavigator, createDrawerNavigator, createBottomTabNavigator, createAppContainer} from "react-navigation";
import {ThemeProvider, Header, Icon} from 'react-native-elements';
import {MenuProvider} from 'react-native-popup-menu';

import ArticleListScreen from './src/ArticleListScreen';
import SettingStack from './src/SettingStack';
import AboutStack from './src/AboutStack';
import WebviewStack from './src/WebviewStack';
// import QrCodeScannerStack from './src/QrCodeScannerStack';

import {ElementsTheme, ThemeColor} from './src/theme';

const MainStack = createStackNavigator({
  Home: {
    screen: ArticleListScreen,
    path: 'home',
  },
  Webview: {
    screen: WebviewStack,
    path: 'webview', // ?uri=encodeURIComponent(url)
  },
  About: {
    screen: AboutStack,
    path: 'about',
  },
  Settings: {
    screen: SettingStack,
    path: 'setting',
  },
  // QrScanner: {
  //   screen: QrCodeScannerStack,
  //   path: 'qrscanner',
  // },
}, {
  initialRouteName: 'Home',
  headerMode: 'none',
});

const MyApp = createAppContainer(MainStack);

const App = () => {
  return (
    <ThemeProvider theme={ElementsTheme}>
      <MenuProvider>
        <MyApp uriPrefix={'pingz://'} />
      </MenuProvider>
    </ThemeProvider>
  )
}

export default App;