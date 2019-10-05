/**
 * 百科详情页
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, ScrollView, View, SafeAreaView, Linking, ProgressViewIOS, ProgressBarAndroid} from 'react-native';
import {Text, Header, Icon} from 'react-native-elements';
import {WebView} from 'react-native-webview';
import Share from 'react-native-share';
import Toast from 'react-native-root-toast';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import DeviceInfo from 'react-native-device-info';
import HeaderLeftBack from './components/HeaderLeftBack';
import HeaderIcon from './components/HeaderIcon';
import HeaderCenterText from './components/HeaderCenterText';
import HeaderMenus from './components/HeaderMenus';
import EmptyBlock from './components/EmptyBlock';
import ServerApi from './server/api';

import {AppTheme, ThemeColor} from './theme';

export default class BaikeDetailStack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      baike: null,
    };

    this.id = this.props.navigation.getParam('id', 0);
  }

  componentDidMount() {
    this.fetchBaikeDetail(this.id);
  }

  fetchBaikeDetail(id) {
    ServerApi.baikeDetail({id})
      .then((res) => {
        if (res && res.data) {
          this.setState({
            baike: res.data,
          });
        }
      })
      .catch((err) => {
        // console.warn(err);
      })
  }

  // 收藏
  onFav = () => {
    ServerApi.baikeFavAdd({
        id: this.id,
        title: this.state.baike.title,
      })
        .then((res) => {
          Toast.show('收藏成功');
        })
        .catch((err) => {
          // console.warn(err);
        });
  }

  formatHtml(html) {
    const finalHtml = '<html><head><meta charset="utf-8">'
      + '<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">'
      + '<meta name="format-detection" content="telephone=no">'
      + '<meta name="apple-mobile-web-app-capable" content="yes">'
      + '<meta name="apple-mobile-web-app-status-bar-style" content="white">'
      + '<style type="text/css">'
      + 'img{max-width: 100%;}'
      + 'body{padding: 12px;'
      + `p{font-size: 14px; color: ${ThemeColor.content};}`
      + '</style>'
      + '</head>'
      + '<body>' + html + '</body>';

    return finalHtml.replace(/src="\/\/img0.pcbaby.com.cn/g, 'src="https://img0.pcbaby.com.cn');
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <StatusBar barStyle="dark-content" />
        <Header
          leftComponent={<HeaderLeftBack />}
          centerComponent={<HeaderCenterText text={this.state.baike && this.state.baike.title ? this.state.baike.title : ''}/>}
          rightComponent={
            <HeaderMenus
              icon={{name: 'options'}}
              menus={[
                {
                  title: '收藏',
                  onPress: this.onFav,
                },
              ]}
            />
          }
        />
        {this.state.baike
          ? <WebView
              ref = {ref => (this.webview = ref)}
              source = {{html: this.state.baike ? this.formatHtml(this.state.baike.contentHtml) : ''}}
              originWhitelist={['*']}
              useWebKit={true}
              userAgent={DeviceInfo.getUserAgent() + ' pingz/' + DeviceInfo.getReadableVersion()}
            />
          : <EmptyBlock />
        }
        
      </View>
    )
  }
}
