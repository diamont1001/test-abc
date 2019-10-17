/**
 * 资讯页
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, StatusBar, ScrollView, View} from 'react-native';
import {Text, Button, Header, Icon, Image} from 'react-native-elements';
import ArticleList from './components/ArticleList';
import HeaderIcon from './components/HeaderIcon';
import HeaderLeftBack from './components/HeaderLeftBack';
import HeaderCenterText from './components/HeaderCenterText';

import {AppTheme, ThemeColor, ThemeSize, HeaderHeight} from './theme';

export default class ArticleStack extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <StatusBar barStyle={'light-content'} />
        <Header
          leftComponent={<HeaderLeftBack />}
          centerComponent={<HeaderCenterText text={'冷知识'} />}
          rightComponent={
            <View style={{flexDirection: 'row'}}>
              <HeaderIcon icon={{name: 'magnifier'}} route={'ArticleSearch'} />
              <HeaderIcon icon={{name: 'heart'}} route={'FavList'} />
            </View>
          }
        />
        <ArticleList />
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
