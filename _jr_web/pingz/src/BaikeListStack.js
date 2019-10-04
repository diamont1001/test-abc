/**
 * 百科列表页
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, View, ScrollView, Alert} from 'react-native';
import {Text, Header, Icon, ListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Share from 'react-native-share';
import Toast from 'react-native-root-toast';
import ActionSheet from 'react-native-actionsheet';
import HeaderLeftBack from './components/HeaderLeftBack';
import HeaderCenterText from './components/HeaderCenterText';
import HeaderMenus from './components/HeaderMenus';
import BaikeList from './components/BaikeList';
import EmptyBlock from './components/EmptyBlock';
import ServerApi from './server/api';

import {AppTheme, ThemeColor, ThemeSize} from './theme';

export default class BaikeListStack extends Component {
  constructor(props) {
    super(props);

    this.subcate = this.props.navigation.getParam('subcate', 0);
    this.subcateName = this.props.navigation.getParam('subcateName', '');
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <StatusBar barStyle="dark-content" />
        <Header
          leftComponent={<HeaderLeftBack/>}
          centerComponent={<HeaderCenterText text={this.subcateName}/>}
        />
        <BaikeList subcate={this.subcate}/>
      </View>
    )
  }
}
