/**
 * 百科二级分类列表（只显示N行）
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text, ListItem} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import SectionHeader from '../SectionHeader';
import SearchBarNavi from '../SearchBarNavi';
import ServerApi from '../../server/api';

import {AppTheme, ThemeColor, ThemeSize} from '../../theme';

const WinWidth = Dimensions.get('window').width;
 
export class BaikeSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curCate: 19,  // 要显示的一级分类的数据
      subcateList: [], // 百科二级分类列表
    }
  }

  async componentDidMount() {
    await this.getBaikeSubcateFromLocal();
    await this.fetchBaikeSubcateList();
  }

  // 查询本地保存的二级分类数据
  async getBaikeSubcateFromLocal() {
    AsyncStorage.getItem('_pingz_baike_subcate_')
      .then(res => {
        try {
          const subcateList = JSON.parse(res);
          if (subcateList && subcateList.length > 0) {
            this.setState({
              subcateList,
            });
          }
          return Promise.resolve();
        } catch (e) {
          console.warn(e);
          return Promise.reject();
        }
      })
      .catch(err => {
        return Promise.reject();
      })
  }

  async fetchBaikeSubcateList() {
    ServerApi.baikeSubcateList()
      .then((res) => {
        if (res && res.data && res.data.content) {
          if (this.state.subcateList.length <= 0) {
            this.setState({
              subcateList: res.data.content,
            });
          }
          // 保存到本地
          AsyncStorage.setItem('_pingz_baike_subcate_', JSON.stringify(res.data.content));
        }
        return Promise.resolve();
      })
      .catch((err) => {
        // console.warn(err);
        return Promise.reject();
      })
  }

  render() {
    const subcates = this.state.subcateList.filter((item) => {
      return item.cate === this.state.curCate;
    });
    subcates.length = Math.min(5, subcates.length); // 最多取N个数

    return (
      <View>
        <SectionHeader title={'热门百科'} />
        <SearchBarNavi
          route={'BaikeSearch'}
          style={{
            backgroundColor: ThemeColor.bgBanner,
            marginLeft: ThemeSize.pagePadding,
            marginRight: ThemeSize.pagePadding,
            marginTop: ThemeSize.pagePadding,
          }}
        />
        {subcates && subcates.length > 0
          ? <View
              style={{
                paddingLeft: ThemeSize.pagePadding,
                paddingRight: ThemeSize.pagePadding,
                paddingBottom: ThemeSize.pagePadding,
              }}
            >
              {subcates.map((item, i) => (
                <ListItem
                  key={`baike-navi-subcate-item-${item.id}`}
                  chevron
                  title={item.name}
                  titleStyle={{color: ThemeColor.content, fontSize: ThemeSize.title}}
                  onPress={() => {
                    this.props.navigation.push('BaikeList', {subcate: item.id, subcateName: item.name});
                  }}
                />
              ))}
            </View>
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

export default withNavigation(BaikeSection);
