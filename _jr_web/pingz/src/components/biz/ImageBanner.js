/**
 * Banner 图标导航条
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text, Image} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import Swiper from 'react-native-swiper';

import {AppTheme, ThemeColor, ThemeSize} from '../../theme';

const WinWidth = Dimensions.get('window').width;
 
export class ImageBanner extends Component {
  constructor(props) {
    super(props);

    this.dataList = [
      {
        image: require('../../images/banner/lengzhishi.jpg'),
        route: 'Article',
        params: {},
        title: '冷知识大全',
      },
      {
        image: require('../../images/banner/baike.png'),
        route: 'Baike',
        params: {},
        title: '百科知识',
      },
      {
        image: require('../../images/banner/yuezican.jpg'),
        route: 'Webview',
        params: {uri: 'http://www.25pin.com/article/20026084'},
        title: '42天月子餐食谱全攻略',
      },
    ];
  }

  render() {
    return (
      this.dataList && this.dataList.length > 0
      ? <Swiper
          style={styles.wrapper}
          showsButtons={false}
          autoplay={true}
          autoplayTimeout={3.8}
          activeDotColor={ThemeColor.primary}
        >
          {this.dataList.map((item, i) => (
            <TouchableOpacity
              key={`image-banner-item-${i}`}
              style={styles.slide}
              onPress={() => {
                if (item.route) {
                  const params = item.params ? item.params : {}
                  this.props.navigation.push(item.route, params);
                }
              }}
            >
              <Image
                style={styles.image}
                source={item.image}
                placeholderStyle={{backgroundColor: 'transparent'}}
              />
            </TouchableOpacity>
          ))}
        </Swiper>
      : null
    );
  }
}

const bannerPadding = ThemeSize.pagePadding;
const imageWidth = WinWidth - bannerPadding * 2;
const imageHeight = imageWidth * 0.47;

const styles = StyleSheet.create({
  wrapper: {
    height: imageHeight + bannerPadding * 2,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: imageWidth,
    height: imageHeight,
    borderRadius: 15,
  },
});

export default withNavigation(ImageBanner);
