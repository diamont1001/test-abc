/**
 * 内容为空提示信息
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';

import {AppTheme, ThemeColor} from '../theme';
 
export default class EmptyBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {content, style, textProps} = this.props;

    return (
      <View style={[styles.container, style]}>
        <Text {...textProps} style={{color: ThemeColor.tips}}>{content ? content : '空空如也'}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
});
