/**
 * 二维码扫描及处理
 * 
 * (还有个 bug 没解决：https://github.com/moaazsidat/react-native-qrcode-scanner/issues/205)
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, Linking, Clipboard, Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Toast from 'react-native-root-toast';
import HeaderLeftBack from './components/HeaderLeftBack';
import MyHeader from './components/MyHeader';

import {AppTheme, ThemeColor, ThemeSize, HeaderHeight} from './theme';

export default class QrCodeScannerStack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scanData: '',
    }
  }

  componentDidMount() {
    this.refs.qrScanner.reactivate();
  }

  textHandler() {
    Alert.alert(
      '扫描结果',
      this.state.scanData || '',
      [
        {
          text: '复制',
          onPress: () => {
            Clipboard.setString(this.state.scanData);
            Toast.show('复制成功', {
              onHide: () => {
                this.props.navigation.goBack();
              }
            });
          }
        },
        {
          text: '重新扫描',
          onPress: () => {
            this.refs.qrScanner.reactivate();
          }
        }
      ]
    )
  }

  onRead = (e) => {
    if (!e || !e.data) {
      this.refs.qrScanner.reactivate();
      return;
    }

    this.setState({
      scanData: e.data,
    });

    // 浆糊动态页，直接打开详情页
    if (e.data.indexOf(`http://www.25pin.com`) === 0 || e.data.indexOf(`https://www.25pin.com`) === 0) {
      this.props.navigation.replace('Webview', {uri: e.data});
      return;
    }

    Linking.canOpenURL(e.data)
      .then((supported) => {
        if (!supported) {
          this.textHandler();
        } else {
          Linking.openURL(e.data)
            .catch((err) => console.warn('[QRCodeScanner] Linking openURL error', err));
          this.props.navigation.goBack();
        }
      })
      .catch((err) => {
        // console.warn(err);
        this.textHandler();
      });
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <MyHeader
          leftComponent={<HeaderLeftBack/>}
        />
        <QRCodeScanner
          ref={'qrScanner'}
          onRead={this.onRead}
          showMarker={true}
          cameraStyle={{height: '100%'}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
