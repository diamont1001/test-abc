/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ProgressViewIOS,
  ProgressBarAndroid,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {WebView} from 'react-native-webview';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import NavigationBar from 'react-native-navbar';
import DeviceInfo from 'react-native-device-info';

const mainColor = '#2BB2BC';
const homePage = 'http://www.25pin.com/';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUrl: '',
      canGoBack: false,
      progress: 0,
    };
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        {/*<NavigationBar
          title = {{
            title: DeviceInfo.getApplicationName(),
            tintColor: mainColor,
          }}
          containerStyle={{
            paddingTop: 12,
            borderBottomWidth: .5,
            borderBottomColor: Colors.lighter,
          }}
          leftButton={(!this.state.canGoBack || this.state.currentUrl === homePage) ? null : {
            title: '返回',
            tintColor: '#b2b2b2',
            handler: () => this.webview.goBack(),
          }}
        />*/}
        <View style={{height: getStatusBarHeight(true), backgroundColor: 'transparent'}}></View>

          <TouchableOpacity
            style={{
              display: (!this.state.canGoBack || this.state.currentUrl === homePage) ? 'none' : 'flex',
              position: 'absolute',
              right: 15,
              top: getStatusBarHeight(true) + 15,
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, .2)',
              borderRadius: 20,
            }}
            onPress={() => this.webview.goBack()}
          >
            <Text
              style={{
                color: '#333',
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
              }}
            >返回</Text>
          </TouchableOpacity>
        {this.state.progress > 0 && this.state.progress < 1 && Platform.OS === 'ios'
          ? <ProgressViewIOS
              progressTintColor={mainColor}
              progress={this.state.progress}
            />
          : null
        }
        {this.state.progress > 0 && this.state.progress < 1 && Platform.OS === 'android'
          ? <ProgressBarAndroid
              styleAttr={'Horizontal'}
              indeterminate={false}
              color={mainColor}
              progress={this.state.progress}
            />
          : null
        }
        <WebView
          ref = {ref => (this.webview = ref)}
          source = {{uri: homePage}}
          useWebKit = {true}
          startInLoadingState = {true}
          originWhitelist={['http://www.25pin.com']}
          onLoadProgress = {syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            this.setState({
              canGoBack: nativeEvent.canGoBack,
              progress: nativeEvent.progress,
              currentUrl: nativeEvent.url,
            });
            // console.log(syntheticEvent.nativeEvent);
          }}
        />

      </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.white,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
