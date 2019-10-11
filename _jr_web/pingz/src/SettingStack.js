/**
 * 设置页面
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, ScrollView, View, ImageBackground, Linking} from 'react-native';
import {Text, Header, Icon, ListItem, Divider} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import ParallaxView from './components/ParallaxView';
import HeaderLeftBack from './components/HeaderLeftBack';
import MyHeader from './components/MyHeader';

import {AppTheme, ThemeColor, ThemeSize, HeaderHeight} from './theme';

export default class SettingStack extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <MyHeader
          leftComponent={<HeaderLeftBack />}
        />
        <ParallaxView
          ref={component => this._scrollView = component}
          backgroundSource={require('./images/bg_setting.jpg')}
          windowHeight={220 + HeaderHeight}
          header={(
            <View
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.bannerTitle}>{'有趣冷知识，小常识百科'}</Text>
              <Text style={styles.bannerDesc}>{DeviceInfo.getApplicationName()} {DeviceInfo.getReadableVersion()}</Text>
            </View>
          )}
        >
          <ListItem
            chevron
            title={'我的收藏'}
            titleStyle={styles.listItemTitle}
            containerStyle={styles.listItemContainer}
            onPress={() => {
              this.props.navigation.push('FavList');
            }}
          />
          <Divider style={{height: ThemeSize.sectionBannerWidth}} />
          <ListItem
            chevron
            title={'关于'}
            titleStyle={styles.listItemTitle}
            containerStyle={styles.listItemContainer}
            onPress={() => {
              this.props.navigation.push('About');
            }}
          />
          <ListItem
            chevron
            title={'官方网站'}
            titleStyle={styles.listItemTitle}
            containerStyle={styles.listItemContainer}
            onPress={() => {
              Linking.openURL('http://www.25pin.com').catch((err) => console.error('open url error', err));
            }}
          />
        </ParallaxView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bannerTitle: {
    fontSize: 22,
    color: ThemeColor.bgText,
    opacity: 0.9,
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    textShadowColor: 'grey',
  },
  bannerDesc: {
    position: 'absolute',
    bottom: 10,
    color: ThemeColor.bgText,
    fontSize: ThemeSize.tips,
    opacity: 0.9,
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    textShadowColor: 'grey',
  },
  listItemContainer: {
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: ThemeColor.bg,
  },
  listItemTitle: {
    color: ThemeColor.text,
    fontSize: ThemeSize.title,
    paddingLeft: 8,
  },
});
