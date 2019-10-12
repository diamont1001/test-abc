/**
 * 娱乐
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, ScrollView, View, Alert} from 'react-native';
import {Header} from 'react-native-elements';
import HeaderCenterText from './components/HeaderCenterText';
import GameNaviItem from './components/GameNaviItem';

import {AppTheme, ThemeColor, ThemeSize} from './theme';
import EmptyBlock from './components/EmptyBlock';

export default class GameScreen extends Component {
  constructor(props) {
    super(props);

    this.gameList = [
      {
        params: {uri: 'http://www.25pin.com/onlinegame/snake'},
        image: require('./images/game-icon/snake.png'),
        title: '贪吃蛇小游戏',
      },
      {
        params: {uri: 'http://yx.h5uc.com/liujiaopinpin/'},
        image: require('./images/game-icon/6jiao.png'),
        title: '六角拼拼',
        fullscreen: 1,
      },
      {
        params: {uri: 'http://yx.h5uc.com/eluosifangkuai/'},
        image: require('./images/game-icon/tetris.png'),
        title: '俄罗斯方块',
        fullscreen: 1,
      },
      {
        params: {uri: 'http://yx.h5uc.com/1010/'},
        image: require('./images/game-icon/tetris2.png'),
        title: '高逼格俄罗斯',
        fullscreen: 1,
      },
      {
        params: {uri: 'http://yx.h5uc.com/2048/'},
        image: require('./images/game-icon/2048.png'),
        title: '经典2048',
      },
      {
        onPress: () => {
          Alert.alert('敬请期待');
        },
        image: require('./images/game-icon/more.png'),
        title: '更多好玩',
      }
    ];
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <StatusBar barStyle={'light-content'} />
        <Header
          centerComponent={<HeaderCenterText text={'放松一下'} />}
        />
        <ScrollView
          contentContainerStyle={{
            padding: ThemeSize.pagePadding,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          {this.gameList && this.gameList.length > 0
            ? this.gameList.map((item, i) => (
                <GameNaviItem
                  key={`game-navi-item-${i}`}
                  onPress={item.onPress}
                  route={item.route}
                  params={item.params}
                  image={item.image}
                  title={item.title}
                  fullscreen={item.fullscreen}
                />
              ))
            : <EmptyBlock />
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
