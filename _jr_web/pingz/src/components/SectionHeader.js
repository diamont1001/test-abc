/**
 * 卡片头部栏
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Text, Icon} from 'react-native-elements';
import {withNavigation} from 'react-navigation';

import {ThemeColor, ThemeSize} from '../theme';

export class SectionHeader extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    title: '',
    route: null,
    params: {},
    onPress: null,
    border: false, // 是否要顶部分隔条
  }

  render() {
    const {title, route, params, onPress, border} = this.props;

    return (
      <View
        style={{
          padding: ThemeSize.pagePadding,
          paddingBottom: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopColor: !!border ? ThemeColor.border : ThemeColor.bg,
          borderTopWidth: ThemeSize.sectionBannerWidth,
        }}
      >
        <View
          style={{
            alignItems: 'flex-start',
            flex: 3,
          }}
        >
          <Text style={{color: ThemeColor.title, fontSize: ThemeSize.title + 1}}>{title}</Text>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            flex: 1,
          }}
        >
          {route || onPress
            ? <View style={{flexDirection: 'row'}}>
                <Text
                  style={{color: ThemeColor.icon, fontSize: ThemeSize.content, paddingRight: 4}}
                  onPress={() => {
                    // 优先使用 onPress
                    if (onPress && typeof onPress === 'function') {
                      onPress();
                      return;
                    }

                    // 支持 route
                    if (route) {
                      this.props.navigation.push(route, params);
                      return;
                    }
                  }}
                >更多</Text>
                <Icon
                  name={'arrow-right'}
                  size={10}
                  containerStyle={{alignItems: 'center', justifyContent: 'center'}}
                />
              </View>
            : null
          }
        </View>
      </View>
    );
  }
}

export default withNavigation(SectionHeader);