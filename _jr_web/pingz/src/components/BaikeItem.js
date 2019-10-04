/**
 * 百科列表的ITEM
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text, Image, Icon} from 'react-native-elements';
import {withNavigation} from 'react-navigation';

import {AppTheme, ThemeColor, ThemeSize} from '../theme';

const WinWidth = Dimensions.get('window').width;

export class BaikeItem extends Component {
  constructor(props) {
    super(props);
  }

  goToDetail() {
    this.props.navigation.push('Webview', {uri: `http://www.25pin.com/baike/${this.props.baike.id}`});
  }

  render() {
    const {baike} = this.props;

    return (
      <TouchableOpacity
        style={{
          marginLeft: ThemeSize.pagePadding,
          marginRight: ThemeSize.pagePadding,
          paddingBottom: 18,
          paddingTop: 18,
          borderTopColor: ThemeColor.border,
          borderTopWidth: .2,
          backgroundColor: ThemeColor.bg,
        }}
        activeOpacity={1}
        onPress={() => this.goToDetail()}
      >
        <Text>{baike.title}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  articleTitle: {
    fontSize: ThemeSize.title,
    color: ThemeColor.content,
    lineHeight: ThemeSize.title * ThemeSize.lineHeight,
  },
  image1: {
    flex: 1,
    width: (WinWidth - 20) * 0.3,
    height: '100%',
  },
  image3: {
    width: (WinWidth - 20 - 2 * 8) * 0.3333,
    height: '100%',
  },
});

export default withNavigation(BaikeItem);
