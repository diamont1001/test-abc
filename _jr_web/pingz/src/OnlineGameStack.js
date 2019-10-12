/**
 * 在线小游戏
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, ScrollView, View, SafeAreaView, Linking, ProgressViewIOS, ProgressBarAndroid} from 'react-native';
import {Text, Header, Icon} from 'react-native-elements';
import {WebView} from 'react-native-webview';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import DeviceInfo from 'react-native-device-info';
import MyHeader from './components/MyHeader';
import HeaderLeftBack from './components/HeaderLeftBack';
import HeaderCenterText from './components/HeaderCenterText';

import {AppTheme, ThemeColor} from './theme';

export default class OnlineGameStack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      canGoBack: false,
      progress: 0,
      userAgent: null,
    };

    this.uri = this.props.navigation.getParam('uri', '');
    this.title = this.props.navigation.getParam('title', '');
    this.fullscreen = this.props.navigation.getParam('fullscreen', false); // 全屏模式（0：不全屏，1：全屏，2：全屏但保留statusbar）
  }

  async componentDidMount() {
    const userAgent = await DeviceInfo.getUserAgent();
    const version = await DeviceInfo.getReadableVersion();

    this.setState({
      userAgent: userAgent + ' pingz/' + version,
    });
  }

  onBack = () => {
    if (this.state.canGoBack) {
      this.webview.goBack();
    } else {
      this.props.navigation.goBack();
    }
  }

  onClose = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        {this.fullscreen === 2 &&
          <View style={{height: getStatusBarHeight(true), backgroundColor: ThemeColor.black}}></View>
        }
        {!!this.fullscreen
          ? <MyHeader
              leftComponent={
                <View style={{flexDirection: 'row'}}>
                  <HeaderLeftBack onGoBack={this.onBack} />
                  {this.state.canGoBack
                    ? <Icon name={'close'} size={24} type={'material-community'} iconStyle={{paddingRight: 5, color: ThemeColor.bgText, lineHeight: 29}} onPress={this.onClose}/>
                    : null
                  }
                </View>
              }
            />
          : <Header
              leftComponent={
                <View style={{flexDirection: 'row'}}>
                  <HeaderLeftBack onGoBack={this.onBack} />
                  {this.state.canGoBack
                    ? <Icon name={'close'} size={24} type={'material-community'} iconStyle={{paddingRight: 5, color: ThemeColor.bgText, lineHeight: 29}} onPress={this.onClose}/>
                    : null
                  }
                </View>
              }
              centerComponent={<HeaderCenterText title={'this.title'} />}
            />
        }
        {this.state.progress > 0 && this.state.progress < 1 && Platform.OS === 'ios'
          ? <ProgressViewIOS
              progressTintColor={ThemeColor.primary}
              progress={this.state.progress}
            />
          : null
        }
        {this.state.progress > 0 && this.state.progress < 1 && Platform.OS === 'android'
          ? <ProgressBarAndroid
              styleAttr={'Horizontal'}
              indeterminate={false}
              color={ThemeColor.primary}
              progress={this.state.progress}
            />
          : null
        }
        {this.state.userAgent
          ?  <WebView
              ref = {ref => (this.webview = ref)}
              source = {{uri: this.uri}}
              originWhitelist={['*']}
              useWebKit={true}
              userAgent={this.state.userAgent}
              onLoadProgress = {syntheticEvent => {
                const {nativeEvent} = syntheticEvent;
                // console.log(nativeEvent);
                this.setState({
                  title: nativeEvent.title,
                  canGoBack: nativeEvent.canGoBack,
                  progress: nativeEvent.progress,
                });
              }}
            />
          : null
        }
      </View>
    )
  }
}
