/**
 * 百科列表的ITEM
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text, Image, Icon, ListItem} from 'react-native-elements';
import {withNavigation} from 'react-navigation';

import {AppTheme, ThemeColor, ThemeSize} from '../theme';

const WinWidth = Dimensions.get('window').width;

export class BaikeItem extends Component {
  constructor(props) {
    super(props);
  }

  goToDetail = () => {
    this.props.navigation.push('BaikeDetail', {id: this.props.baike.id});
  }

  render() {
    const {baike} = this.props;

    return (
      <ListItem
        chevron
        title={baike.title}
        titleStyle={{fontSize: ThemeSize.title}}
        onPress={this.goToDetail}
        containerStyle={{borderBottomWidth: .5, borderBottomColor: ThemeColor.border, height: 58}}
      />
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
