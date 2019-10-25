/**
 * 标签分类下的文章列表页
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, View} from 'react-native';
import {Text, Header, Icon} from 'react-native-elements';
import Share from 'react-native-share';
import DeviceInfo from 'react-native-device-info';
import HeaderLeftBack from './components/HeaderLeftBack';
import HeaderIcon from './components/HeaderIcon';
import HeaderCenterText from './components/HeaderCenterText';
import ArticleList from './components/biz/ArticleList';

import {AppTheme, ThemeColor} from './theme';

export default class ArticleByTagStack extends Component {
  constructor(props) {
    super(props);

    this.tagId = this.props.navigation.getParam('tagId', 0);
    this.tagName = this.props.navigation.getParam('tagName', '');
  }

  onShare = () => {
    Share.open({
        url: `http://www.25pin.com/article/t_${this.tagId}`,
        title: DeviceInfo.getApplicationName(),
        message: this.tagName + '_' + DeviceInfo.getApplicationName(),
      })
        .then((res) => {
          console.log('share ok.')
        })
        .catch((err) => {
          console.warn(err);
        });
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <StatusBar barStyle="dark-content" />
        <Header
          leftComponent={<HeaderLeftBack/>}
          centerComponent={<HeaderCenterText text={this.tagName}/>}
          rightComponent={
            <HeaderIcon
              icon={{name: 'md-share', type: 'ionicon'}}
              onPress={this.onShare}
            />
          }
        />
        <ArticleList tagId={this.tagId} />
      </View>
    )
  }
}
