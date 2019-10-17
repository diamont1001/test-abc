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

  static defaultProps = {
    icon: null,
    onPress: null,
    route: null,
    params: {},
  };

  render() {
    const {
      icon, // {name, type, color}
      onPress, // {function} 优先，如果有传这个则忽略 route
      route, // 点击后的路由（onPress 参数优先）
      params, // 配合路由使用
    } = this.props;

    return (
      icon && icon.name
        ? (<Icon
            name={icon.name}
            type={icon.type ? icon.type : 'simple-line-icon'}
            iconStyle={{padding: 10, color: icon && icon.color ? icon.color : ThemeColor.bgText}}
            onPress={(onPress || route)
              ? (() => {
                  if (onPress && typeof onPress === 'function') {
                    onPress();
                    return;
                  }

                  if (route) {
                    this.props.navigation.push(route, params);
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
