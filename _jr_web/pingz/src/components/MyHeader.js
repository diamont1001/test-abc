/**
 * 自定义头部，支持背景透明
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {ThemeColor, HeaderHeight} from '../theme';

export default class HeaderIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      leftComponent,
      centerComponent,
      rightComponent,
    } = this.props;

    return (
      this.props.children
        ? <View style={[styles.header, style]}>
            {this.props.children}
          </View>
        : <View style={[styles.header, style]}>
            <View
              style={{
                alignItems: 'flex-start',
                flex: 1,
              }}
            >
              {leftComponent ? leftComponent : <Text></Text>}
            </View>
            <View
              style={{
                alignItems: 'center',
                // flexGrow: 1,
                flex: 3,
              }}
            >
              {centerComponent ? centerComponent : <Text></Text>}
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                flex: 1,
              }}
            >
              {rightComponent ? rightComponent : <Text></Text>}
            </View>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    height: HeaderHeight,
    paddingTop: getStatusBarHeight(true),
    paddingHorizontal: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});