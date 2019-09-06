/**
 * 资讯
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, ScrollView, View} from 'react-native';
import {Text, Button, Header, Icon, Image} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import ArticleList from './components/ArticleList';
import HeaderIcon from './components/HeaderIcon';
import HeaderCenterText from './components/HeaderCenterText';
import HeaderMenus from './components/HeaderMenus';

import {AppTheme, ThemeColor, ThemeSize} from './theme';

export default class ArticleListScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <Header
          leftComponent={<HeaderIcon icon={{name: 'star'}} route={'FavList'}/>}
          centerComponent = {<HeaderCenterText text={'瓶子老师冷知识'}/>}
          rightComponent={
            <HeaderMenus
              icon={{name: 'more-horiz'}}
              menus={[
                {
                  title: '设置',
                  route: 'Settings',
                },
                {
                  title: '关于',
                  route: 'About',
                },
              ]}
            />
          }
        />
        <ArticleList />
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
