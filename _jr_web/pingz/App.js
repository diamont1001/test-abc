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
import DiscoveryScreen from './src/DiscoveryScreen';
import ArticleByTagStack from './src/ArticleByTagStack';
import FavListStack from './src/FavListStack';
import SettingStack from './src/SettingStack';
import AboutStack from './src/AboutStack';
import WebviewStack from './src/WebviewStack';
// import QrCodeScannerStack from './src/QrCodeScannerStack';

import {ElementsTheme, ThemeColor} from './src/theme';

// Tab: 应用主界面组
const MyTabNavigator = createBottomTabNavigator({
  Home: {
    screen: ArticleListScreen,
    navigationOptions: {
      title: '首页',
    },
    path: 'home',
  },
  Discovery: {
    screen: DiscoveryScreen,
    navigationOptions: {
      title: '发现',
    },
    path: 'discovery',
  },
}, {
  initialRouteName: 'Home',
  tabBarOptions: {
    activeTintColor: ThemeColor.primary,
    // activeBackgroundColor: 'red',
    inactiveTintColor: ThemeColor.icon,
    // inactiveBackgroundColor: 'red',
    showLabel: true,
    showIcon: true,
    labelStyle: {
      // fontSize: 12,
      // color: ThemeColor.text,
    },
    style: {
      backgroundColor: ThemeColor.bgBanner,
    },
  },
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      let iconType = 'material-community';
      if (routeName === 'Home') {
        iconName = 'home';
      } else if (routeName === 'Discovery') {
        iconName = 'search';
        iconType = 'material';
      }

      return <Icon name={iconName} type={iconType} color={tintColor} />;
    },
  }),
});

const MainStack = createStackNavigator({
  App: {
    screen: MyTabNavigator,
    path: 'app',
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
  ArticleTag: {
    screen: ArticleByTagStack,
    path: 'articleTag',
  },
  FavList: {
    screen: FavListStack,
    path: 'articleTag',
  },
  // QrScanner: {
  //   screen: QrCodeScannerStack,
  //   path: 'qrscanner',
  // },
}, {
  initialRouteName: 'App',
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