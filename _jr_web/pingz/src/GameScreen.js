/**
 * 娱乐
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, StatusBar, ScrollView, View, TouchableOpacity, Alert} from 'react-native';
import {Text, Button, Header, Icon, Image} from 'react-native-elements';
import HeaderCenterText from './components/HeaderCenterText';

import {AppTheme, ThemeColor, ThemeSize} from './theme';

const WinWidth = Dimensions.get('window').width;

export default class GameScreen extends Component {
  constructor(props) {
    super(props);
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
          <TouchableOpacity
            style={styles.listItemContainer}
            // activeOpacity={1}
            onPress={() => {
              this.props.navigation.push('Webview', {uri: 'http://www.25pin.com/onlinegame/snake'});
            }}
          >
            <View style={styles.listItemInner}>
              <View style={styles.listItemInner2}></View>
              <Image
                placeholderStyle={{backgroundColor: 'transparent'}}
                style={styles.image} resizeMode={'cover'} source={require('./images/game-icon/snake.png')}
              />
              <View style={{marginTop: 8}}>
                <Text style={styles.title}>{'贪吃蛇小游戏'}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItemContainer}
            // activeOpacity={1}
            onPress={() => {
              Alert.alert(
                '敬请期待',
              );
            }}
          >
            <View style={styles.listItemInner}>
              <View style={styles.listItemInner2}></View>
              <Image
                placeholderStyle={{backgroundColor: 'transparent'}}
                style={styles.image} resizeMode={'cover'} source={require('./images/game-icon/more.png')}
              />
              <View style={{marginTop: 8}}>
                <Text style={styles.title}>{'敬请期待'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  listItemContainer: {
    width: (WinWidth - ThemeSize.pagePadding * 2) / 2,
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemInner: {
    width: '88%',
    height: '88%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: ThemeColor.border,
    borderWidth: 1,
    borderRadius: 20,
  },
  listItemInner2: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 3,
    left: 3,
    borderColor: ThemeColor.border,
    borderWidth: 1,
    borderRadius: 20,
  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: ThemeSize.title,
    color: ThemeColor.content,
  }
});
