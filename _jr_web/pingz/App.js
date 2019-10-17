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

import HomeScreen from './src/HomeScreen';
import SettingScreen from './src/SettingScreen';
import ArticleStack from './src/ArticleStack';
import BaikeStack from './src/BaikeStack';
// import GameScreen from './src/GameScreen';
import ArticleSearchStack from './src/ArticleSearchStack';
import BaikeSearchStack from './src/BaikeSearchStack';
import ArticleByTagStack from './src/ArticleByTagStack';
import BaikeListStack from './src/BaikeListStack';
import BaikeDetailStack from './src/BaikeDetailStack';
import FavListStack from './src/FavListStack';
// import OnlineGameStack from './src/OnlineGameStack';
import AboutStack from './src/AboutStack';
import WebviewStack from './src/WebviewStack';
// import QrCodeScannerStack from './src/QrCodeScannerStack';

import {ElementsTheme, ThemeColor} from './src/theme';

// Tab: 应用主界面组
const MyTabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: '首页',
    },
    path: 'home',
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions: {
      title: '设置',
    },
    path: 'setting',
  },
  // Game: {
  //   screen: GameScreen,
  //   navigationOptions: {
  //     title: '娱乐',
  //   },
  //   path: 'game',
  // },
}, {
  initialRouteName: 'Home',
  lazy: false,
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
      let iconType = 'simple-line-icon';
      if (routeName === 'Home') {
        iconName = 'home';
      } else if (routeName === 'Setting') {
        iconName = 'settings';
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
    screen: SettingScreen,
    path: 'setting',
  },
  Article: {
    screen: ArticleStack,
    path: 'article',
  },
  ArticleSearch: {
    screen: ArticleSearchStack,
    path: 'articleSearch',
  },
  ArticleTag: {
    screen: ArticleByTagStack,
    path: 'articleTag',
  },
  FavList: {
    screen: FavListStack,
    path: 'favList',
  },
  Baike: {
    screen: BaikeStack,
    path: 'baike',
  },
  BaikeList: {
    screen: BaikeListStack,
    path: 'baikeList',
  },
  BaikeDetail: {
    screen: BaikeDetailStack,
    path: 'baike',
  },
  BaikeSearch: {
    screen: BaikeSearchStack,
    path: 'baikeSearch',
  },
  // OnlineGame: {
  //   screen: OnlineGameStack,
  //   path: 'onlineGame',
  // },
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