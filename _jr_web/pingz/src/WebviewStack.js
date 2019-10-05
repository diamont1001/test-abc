/**
 * Webview页面
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
import ServerApi from './server/api';

import {AppTheme, ThemeColor} from './theme';

export default class WebviewStack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      canGoBack: false,
      progress: 0,
      url: '',
    };

    this.uri = this.props.navigation.getParam('uri');
    this.noShare = this.props.navigation.getParam('noShare');
  }

  componentDidMount() {
    if (!this.uri) {
      this.props.navigation.goBack();
    } else {
      this.setState({
        url: this.uri,
      });
    }
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

  // 收藏
  onFav = () => {
    ServerApi.favAdd({
        url: this.state.url,
        title: this.state.title,
      })
        .then((res) => {
          Toast.show('收藏成功');
        })
        .catch((err) => {
          // console.warn(err);
        });
  }

  // 分享
  onShare = () => {
    Share.open({
        url: this.state.url,
        title: DeviceInfo.getApplicationName(),
        message: this.state.title,
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
          leftComponent={
            <View style={{flexDirection: 'row'}}>
              <HeaderLeftBack onGoBack={this.onBack} />
              {this.state.canGoBack
                ? <Icon name={'close'} size={24} type={'material-community'} iconStyle={{paddingRight: 5, color: ThemeColor.bgText, lineHeight: 29}} onPress={this.onClose}/>
                : null
              }
            </View>
          }
          rightComponent={
            this.noShare
              ? null
              : <HeaderMenus
                  icon={{name: 'options'}}
                  menus={[
                    {
                      title: '收藏',
                      onPress: this.onFav,
                      disabled: !(this.state.url && this.state.title),
                    },
                    {
                      title: '分享',
                      onPress: this.onShare,
                    },
                  ]}
                />
          }
        />
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
        <WebView
          ref = {ref => (this.webview = ref)}
          source = {{uri: this.state.url}}
          originWhitelist={['http://www.25pin.com', 'https://www.25pin.com']}
          useWebKit={true}
          userAgent={DeviceInfo.getUserAgent() + ' pingz/' + DeviceInfo.getReadableVersion()}
          onLoadProgress = {syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            // console.log(nativeEvent);
            this.setState({
              title: nativeEvent.title,
              canGoBack: nativeEvent.canGoBack,
              progress: nativeEvent.progress,
              url: nativeEvent.url,
            });
          }}
        />
      </View>
    )
  }
}
