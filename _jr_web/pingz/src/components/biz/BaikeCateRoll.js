/**
 * 百科一级分类 滚动展示条
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text, Image} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import Swiper from 'react-native-swiper';
import SectionHeader from '../SectionHeader';

import {AppTheme, ThemeColor, ThemeSize} from '../../theme';

const WinWidth = Dimensions.get('window').width;
 
export class BaikeCateRoll extends Component {
  constructor(props) {
    super(props);

    this.dataList = [
      [{id: 18, name: '生活百科'}, {id: 16, name: '美食百科'}],
      [{id: 20, name: '用品百科'}, {id: 9, name: '孕期百科'}],
      [{id: 15, name: '分娩百科'}, {id: 10, name: '新生儿百科'}],
      [{id: 14, name: '月子百科'}, {id: 17, name: '备孕百科'}],
    ];
  }

  render() {
    return (
      this.dataList && this.dataList.length > 0
      ? <View style={styles.container}>
          <SectionHeader title={'百科热门'} />
          <View style={styles.swiperContainer}>
            <Swiper
              style={styles.swiper}
              horizontal={false}
              showsButtons={false}
              showsPagination={false}
              autoplay={true}
              autoplayTimeout={3}
              activeDotColor={ThemeColor.primary}
            >
              {this.dataList.map((item, i) => (
                <View
                  key={`baike-cate-roll-item-${i}`}
                  style={styles.swiperItem}
                >
                  <TouchableOpacity
                    style={styles.swiperItemInner}
                    onPress={() => {
                      this.props.navigation.push('Baike', {cate: item[0].id});
                    }}
                  >
                    <Text style={styles.title}>{item[0].name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.swiperItemInner}
                    onPress={() => {
                      this.props.navigation.push('Baike', {cate: item[1].id});
                    }}
                  >
                    <Text style={styles.title}>{item[1].name}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Swiper>
          </View>
        </View>
      : null
    );
  }
}

const margin = 4;
const col = 2;
const itemWidth = (WinWidth - ThemeSize.pagePadding * 2 - margin * col * 2) / col;

const styles = StyleSheet.create({
  container: {
    paddingBottom: ThemeSize.pagePadding,
  },
  swiperContainer: {
    height: 38,
    marginTop: 8,
  },
  swiper: {
  },
  swiperItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingLeft: ThemeSize.pagePadding,
    paddingRight: ThemeSize.pagePadding,
  },
  swiperItemInner: {
    width: itemWidth,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
    margin: margin,
    paddingLeft: ThemeSize.pagePadding,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ThemeColor.border,
  },
  title: {
    fontSize: ThemeSize.content,
    color: ThemeColor.content,
  },
});

export default withNavigation(BaikeCateRoll);
