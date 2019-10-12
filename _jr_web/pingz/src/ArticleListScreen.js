/**
 * 资讯
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, StatusBar, ScrollView, View} from 'react-native';
import {Text, Button, Header, Icon, Image} from 'react-native-elements';
import ArticleList from './components/ArticleList';
import MyHeader from './components/MyHeader';
import SearchBarNavi from './components/SearchBarNavi';
import HeaderMenus from './components/HeaderMenus';

import {AppTheme, ThemeColor, ThemeSize, HeaderHeight} from './theme';

export default class ArticleListScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <StatusBar barStyle={'light-content'} />
        <MyHeader style={{position: 'relative', backgroundColor: ThemeColor.primary}}>
          <SearchBarNavi route={'ArticleSearch'} title={'文章搜索'} />
          <View style={{flex: 0}}>
            <HeaderMenus
              icon={{name: 'options'}}
              menus={[
                {
                  title: '文章收藏',
                  route: 'FavList',
                },
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
          </View>
        </MyHeader>
        <ArticleList />
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
