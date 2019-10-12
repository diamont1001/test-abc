/**
 * 游戏导航入口
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, Dimensions, TouchableOpacity} from 'react-native';
import {Text, Image} from 'react-native-elements';
import {withNavigation} from 'react-navigation';

import {ThemeSize, ThemeColor} from '../theme';

const WinWidth = Dimensions.get('window').width;

export class GameNaviItem extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    onPress: null,
    route: 'OnlineGame',
    params: {},
    image: null, // 图片资源 object{uri}
    title: '',
    fullscreen: 0, // 全屏模式（0：不全屏，1：全屏，2：全屏但保留statusbar）
  };

  render() {
    const params = Object.assign({}, this.props.params, {fullscreen: this.props.fullscreen});

    return (
      <TouchableOpacity
        style={styles.container}
        // activeOpacity={1}
        onPress={() => {
          if (this.props.onPress && typeof this.props.onPress === 'function') {
            this.props.onPress();
            return;
          }

          this.props.navigation.push(this.props.route, params);
        }}
      >
        <View style={styles.innerWrapper}>
          <View style={styles.innerWrapper2}></View>
          <Image
            placeholderStyle={{backgroundColor: 'transparent'}}
            style={styles.logo} resizeMode={'cover'} source={this.props.image}
          />
          <View style={{marginTop: 8}}>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const listItemWidth = (WinWidth - ThemeSize.pagePadding * 2) / 2;
const listItemHeight = Math.max(168, listItemWidth * 0.618); // 黄金比例

const styles = StyleSheet.create({
  container: {
    width: listItemWidth,
    height: listItemHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerWrapper: {
    width: '88%',
    height: '88%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: ThemeColor.border,
    borderWidth: 1,
    borderRadius: 20,
  },
  innerWrapper2: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 3,
    left: 3,
    borderColor: ThemeColor.border,
    borderWidth: 1,
    borderRadius: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: ThemeSize.title,
    color: ThemeColor.content,
  }
});

export default withNavigation(GameNaviItem);
