/**
 * 文章核心分类的导航条
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text, Image} from 'react-native-elements';
import {withNavigation} from 'react-navigation';

import {AppTheme, ThemeColor, ThemeSize} from '../theme';

const WinWidth = Dimensions.get('window').width;
 
export class ArticleNavi extends Component {
  constructor(props) {
    super(props);

    this.dataList = [
      {id: 9, name: '游戏', icon: require('../images/navi-icon/game.png')},
      {id: 12, name: '母婴', icon: require('../images/navi-icon/baby.png')},
      {id: 11, name: '美食', icon: require('../images/navi-icon/meishi.png')},
      {id: 7, name: '英语', icon: require('../images/navi-icon/english.png')},
    ];
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          borderBottomColor: ThemeColor.border,
          borderBottomWidth: ThemeSize.sectionBannerWidth,
        }}
      >
        {this.dataList && this.dataList.length > 0
          ? this.dataList.map((item, i) => (
              <TouchableOpacity
                key={`article-navi-item-${i}`}
                style={{
                  width: WinWidth / 4,
                  height: 118,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                // activeOpacity={1}
                onPress={() => {
                  this.props.navigation.push('ArticleTag', {tagId: item.id, tagName: item.name});
                }}
              >
                <Image
                  containerStyle={styles.imageContainer}
                  placeholderStyle={{backgroundColor: 'transparent'}}
                  style={styles.image} resizeMode={'cover'} source={item.icon}
                />
                <View style={{marginTop: 8}}>
                  <Text style={styles.title}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: ThemeSize.content,
    color: ThemeColor.content,
  }
});

export default withNavigation(ArticleNavi);
