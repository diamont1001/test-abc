/**
 * 主导航
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text, Icon} from 'react-native-elements';
import {withNavigation} from 'react-navigation';

import {AppTheme, ThemeColor, ThemeSize} from '../../theme';

const WinWidth = Dimensions.get('window').width;
 
export class MainNavi extends Component {
  constructor(props) {
    super(props);

    this.dataList = [
      {route: 'Article', name: '冷知识', color: 'rgb(48, 209, 88)', icon: {name: 'globe-alt'}},
      {route: 'Baike', name: '百科', color: 'rgb(255, 149, 0)', icon: {name: 'graduation'}},
    ];
  }

  render() {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: ThemeSize.pagePadding,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          {this.dataList && this.dataList.length > 0
            ? this.dataList.map((item, i) => (
                <TouchableOpacity
                  key={`baike-navi-item-${i}`}
                  style={styles.listItem}
                  // activeOpacity={1}
                  onPress={() => {
                    if (item.route) {
                      this.props.navigation.push(item.route);
                      return;
                    }
                  }}
                >
                  {item.icon
                    ? <Icon {...item.icon} size={22} containerStyle={{paddingRight: 10}} />
                    : null
                  }
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
const itemWidth = (WinWidth - ThemeSize.pagePadding * 2 - margin * col) / col;
const itemHeight = itemWidth * 0.333;

const styles = StyleSheet.create({
  listItem: {
    width: itemWidth,
    height: itemHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: ThemeColor.border,
    backgroundColor: ThemeColor.bgBanner,
  },
  title: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: ThemeColor.icon,
  }
});

export default withNavigation(MainNavi);
