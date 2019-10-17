/**
 * 百科一级分类的导航
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import SectionHeader from '../SectionHeader';

import {AppTheme, ThemeColor, ThemeSize} from '../../theme';

const WinWidth = Dimensions.get('window').width;
 
export class BaikeNavi extends Component {
  constructor(props) {
    super(props);

    this.dataList = [
      {id: 18, name: '生活百科', color: 'rgb(100, 210, 255)'},
      {id: 16, name: '美食百科', color: 'rgb(255, 159, 10)'},
      {id: 20, name: '用品百科', color: 'rgb(191, 90, 242)'},
      {id: 9, name: '孕期百科', color: 'rgb(48, 209, 88)'},
    ];
  }

  render() {
    return (
      <View>
        <SectionHeader title={'百科知识'} route={'Baike'} />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: ThemeSize.pagePadding,
            paddingTop: 8,
          }}
        >
          {this.dataList && this.dataList.length > 0
            ? this.dataList.map((item, i) => (
                <TouchableOpacity
                  key={`baike-navi-item-${i}`}
                  style={[styles.listItem, {
                    backgroundColor: item.color,
                  }]}
                  // activeOpacity={1}
                  onPress={() => {
                    if (item.route) {
                    this.props.navigation.push(item.route);
                    return;
                    }
                    this.props.navigation.push('Baike', {cate: item.id});
                  }}
                >
                  <View style={{}}>
                    <Text style={styles.title}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))
            : null
          }
        </View>
      </View>
    );
  }
}

const margin = 4;
const col = 2;
const itemWidth = (WinWidth - ThemeSize.pagePadding * 2 - margin * col * 2) / col;
const itemHeight = itemWidth * 0.45;

const styles = StyleSheet.create({
  listItem: {
    width: itemWidth,
    height: itemHeight,
    alignItems: 'center',
    justifyContent: 'center',
    margin: margin,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    color: ThemeColor.bgText,
  }
});

export default withNavigation(BaikeNavi);
