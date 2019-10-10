/**
 * 头部的菜单
 * 
 */

import React, {Component} from 'react';
import {Icon} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';
import HeaderIcon from './HeaderIcon';

import {ThemeColor, ThemeSize} from '../theme';

export class HeaderMenus extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      icon, // {name, type, color}
      /**
       * menus {array} 菜单数组
       *   - menus.title {string} 菜单title
       *   - menus.auth {true/false} 是否需要登录检测
       *   - menus.onPress, // {function} 优先，如果有传这个则忽略 route
       *   - menus.route, // 点击后的路由（onPress 参数优先）
       */
      menus,
    } = this.props;

    return (
      menus && menus.length
        ? (<Menu>
            <MenuTrigger
              customStyles={{
                triggerTouchable: {
                  underlayColor: 'transparent',
                },
              }}
            >
              <HeaderIcon icon={icon}/>
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  width: 118,
                },
                optionsWrapper: {
                  padding: 4,
                }
              }}
            >
              {menus.map((menu, i) => (
                <MenuOption
                  key={i}
                  disabled={menu.disabled}
                  text={menu.title}
                  onSelect={() => {
                    // 优先使用 onPress
                    if (menu.onPress && typeof menu.onPress === 'function') {
                      menu.onPress();
                      return;
                    }

                    // 支持 route
                    if (menu.route) {
                      this.props.navigation.push(menu.route);
                      return;
                    }
                  }}
                  customStyles={{
                    optionWrapper: {
                      padding: 10,
                      borderBottomColor: ThemeColor.border,
                      borderBottomWidth: i + 1 === menus.length ? 0 : .3,
                    },
                    optionText: {
                      fontSize: ThemeSize.title,
                    }
                  }}
                />
              ))}
            </MenuOptions>
          </Menu>)
        : null
    );
  }
}

export default withNavigation(HeaderMenus);
