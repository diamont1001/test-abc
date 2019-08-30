/**
 * 文档页面
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Text, Header, Icon, Image} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import HeaderLeftBack from './components/HeaderLeftBack';
import HeaderCenterText from './components/HeaderCenterText';

import {AppTheme, ThemeColor, ThemeSize} from './theme';

export default class AboutStack extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <Header
          leftComponent={<HeaderLeftBack />}
          centerComponent={<HeaderCenterText text={'关于'} />}
        />
        <View style={styles.contentContainer}>
          <View style={{
            flexDirection: 'row',
          }}>
            <Image
              source={require('./images/icon.png')}
              style={{width: 55, height: 55}}
            />
            <View style={{height: 55, paddingLeft: 12, justifyContent: 'center'}}>
              <Text style={{color: ThemeColor.title, fontSize: 30}}>{DeviceInfo.getApplicationName()}</Text>
              <Text style={{}}>www.25pin.com</Text>
            </View>
          </View>
          <View style={{margin: 20}}>
            <Text style={{textAlign: 'center', color: ThemeColor.tips}}>v{DeviceInfo.getReadableVersion()}</Text>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <Text>
            {DeviceInfo.getApplicationName()}
            <Text
              style={{color: ThemeColor.link}}
              onPress={() => this.props.navigation.push('Webview', {uri: 'http://www.25pin.com/privacy', noShare: true})}
            > 隐私条款</Text>
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    paddingBottom: getBottomSpace() + 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
