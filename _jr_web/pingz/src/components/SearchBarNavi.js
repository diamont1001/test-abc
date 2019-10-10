/**
 * 搜索导航条
 * 
 */

import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {withNavigation} from 'react-navigation';

import {ThemeColor, ThemeSize, HeaderHeight} from '../theme';

export class SearchBarNavi extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      onPress, // {function} 优先，如果有传这个则忽略 route
      route, // 点击后的路由（onPress 参数优先）
    } = this.props;

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          margin: 8,
          marginTop: 8,
          marginBottom: 8,
          backgroundColor: ThemeColor.bg,
          flexDirection: 'row',
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 15,
          paddingRight: 15,
          alignItems: 'center',
          borderRadius: 25,
          height: 38,
        }}
        activeOpacity={1}
        onPress={(onPress || route)
          ? (() => {
              if (onPress && typeof onPress === 'function') {
                onPress();
                return;
              }
              if (route) {
                this.props.navigation.push(route);
              }
            })
          : null
        }
      >
        <Icon name={'search1'} type={'antdesign'} size={16} color={ThemeColor.tips} />
        <Text style={{paddingLeft: 10, fontSize: ThemeSize.content, color: ThemeColor.tips}}>{title ? title : '搜索一下'}</Text>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(SearchBarNavi);
