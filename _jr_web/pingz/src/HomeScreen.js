/**
 * 首页
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, StatusBar, ScrollView, View} from 'react-native';
import {Header} from 'react-native-elements';
import ImageBanner from './components/biz/ImageBanner';
import MainNavi from './components/biz/MainNavi';
import BaikeCateRoll from './components/biz/BaikeCateRoll';
import ArticleNavi from './components/biz/ArticleNavi';
import ArticleSection from './components/biz/ArticleSection';
import BaikeSection from './components/biz/BaikeSection';
import HeaderCenterText from './components/HeaderCenterText';
import HeaderIcon from './components/HeaderIcon';

import {AppTheme, ThemeColor, ThemeSize, HeaderHeight} from './theme';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <StatusBar barStyle={'light-content'} />
        <Header
          centerComponent={<HeaderCenterText text={'瓶子老师·冷知识·百科'} />}
          rightComponent={<HeaderIcon icon={{name: 'settings'}} route={'Settings'} />}
        />
        <ScrollView
          contentContainerStyle={{paddingBottom: ThemeSize.pagePadding}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator ={false}
        >
          <ImageBanner />
          <MainNavi />
          <BaikeCateRoll />
          <BaikeSection />
          <ArticleNavi />
          <ArticleSection />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
