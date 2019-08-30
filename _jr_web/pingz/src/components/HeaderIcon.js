/**
 * 头部的ICON
 * 
 */

import React, {Component} from 'react';
import {Icon} from 'react-native-elements';
import {withNavigation} from 'react-navigation';

import {ThemeColor} from '../theme';

export class HeaderIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      icon, // {name, type}
      auth, // {true/false} 是否需要登录检测
      onPress, // {function} 优先，如果有传这个则忽略 route
      route, // 点击后的路由（onPress 参数优先）
    } = this.props;

    return (
      icon && icon.name
        ? (<Icon
            name={icon.name}
            type={icon.type ? icon.type : 'material'}
            iconStyle={{padding: 10, color: ThemeColor.bgText}}
            onPress={(auth || onPress || route)
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
          />)
        : null
    );
  }
}

export default withNavigation(HeaderIcon);
