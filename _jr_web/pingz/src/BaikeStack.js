/**
 * 百科
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, StatusBar, ScrollView, View, TouchableOpacity, FlatList} from 'react-native';
import {Text, Button, Header, Icon, Image, ListItem, Divider} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderLeftBack from './components/HeaderLeftBack';
import HeaderIcon from './components/HeaderIcon';
import HeaderCenterText from './components/HeaderCenterText';
import EmptyBlock from './components/EmptyBlock';
import ServerApi from './server/api';

import {AppTheme, ThemeColor, ThemeSize, HeaderHeight} from './theme';

export default class BaikeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cateList: [], // 百科一级分类列表
      subcateList: [], // 百科二级分类列表
      curCate: 0,
    }

    this.cate = this.props.navigation.getParam('cate', 0);
  }

  async componentDidMount() {
    this.setState({
      curCate: this.cate,
    });

    await this.getBaikeCateFromLocal();
    await this.getBaikeSubcateFromLocal();

    await this.fetchBaikeCateList();
    await this.fetchBaikeSubcateList();
  }

  // 查询本地保存的一级分类数据
  async getBaikeCateFromLocal() {
    AsyncStorage.getItem('_pingz_baike_cate_')
      .then(res => {
        try {
          const cates = JSON.parse(res);
          if (cates && cates.length > 0) {
            this.setState({
              cateList: cates,
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

  // 百科一级分类数据
  async fetchBaikeCateList() {
    ServerApi.baikeCateList()
      .then((res) => {
        if (res && res.data && res.data.content) {
          if (this.state.cateList.length <= 0) {
            this.setState({
              cateList: res.data.content,
              curCate: res.data.content.length > 0 ? res.data.content[0].id : 0,
            });
          }
          // 保存到本地
          AsyncStorage.setItem('_pingz_baike_cate_', JSON.stringify(res.data.content));
        }
        return Promise.resolve();
      })
      .catch((err) => {
        // console.warn(err);
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
    const {cateList, subcateList} = this.state;
    let curCate = this.state.curCate > 0
      ? this.state.curCate
      : this.state.cateList.length  > 0
      ? this.state.cateList[0].id
      : 0;
    const subcates = subcateList.filter((item) => {
      return item.cate === curCate;
    })

    return (
      <View style={AppTheme.pageContainer}>
        <StatusBar barStyle={'light-content'} />
        <Header
          leftComponent={<HeaderLeftBack />}
          centerComponent={<HeaderCenterText text={'百科知识'} />}
          rightComponent={
            <View style={{flexDirection: 'row'}}>
              <HeaderIcon icon={{name: 'magnifier'}} route={'BaikeSearch'} />
              <HeaderIcon icon={{name: 'heart'}} route={'FavList'} params={{tab: 1}} />
            </View>
          }
        />
        {/*<View
          style={{
            paddingTop: 4,
            alignItems: 'flex-start',
            backgroundColor: ThemeColor.bgBanner,
          }}
        >
          <ScrollView
            style={{
              flexGrow: 0,
              paddingLeft: 7,
              paddingRight: 7,
              paddingBottom: 4,
              backgroundColor: ThemeColor.bgBanner,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {cateList && cateList.length > 0
              ? cateList.map((cate, i) => (
                  <TouchableOpacity
                    key={`${cate.id}`}
                    activeOpacity={1}
                    style={{
                      height: 40,
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      this.setState({
                        curCate: cate.id,
                      });
                      // 滚回顶部
                      this.subcateFlatList && this.subcateFlatList.scrollToIndex({
                        index: 0, viewOffset: 0, viewPosition: 0,
                        animated: false,
                      })
                    }}
                  >
                    <Text
                      style={{
                        color: cate.id === curCate ? ThemeColor.title : ThemeColor.text,
                        fontSize: cate.id === curCate ? ThemeSize.title + 6 : ThemeSize.title,
                        paddingLeft: 8, paddingRight: 8,
                      }}
                    >{cate.name}</Text>
                  </TouchableOpacity>
                ))
              : null
            }
          </ScrollView>
        </View>*/}
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}
        >
          {cateList && cateList.length > 0
            ? <ScrollView
                style={{
                  flexGrow: 0,
                  width: 128,
                  backgroundColor: ThemeColor.bgBlock,
                }}
                showsVerticalScrollIndicator={false}
              >
                {cateList && cateList.length > 0
                  ? cateList.map((cate, i) => (
                      <TouchableOpacity
                        key={`${cate.id}`}
                        // activeOpacity={1}
                        style={{
                          height: 69,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: cate.id === curCate ? ThemeColor.bg : ThemeColor.bgBlock,
                          borderBottomColor: ThemeColor.border,
                          borderBottomWidth: 1,
                          borderRightColor: ThemeColor.border,
                          borderRightWidth: cate.id === curCate ? 0 : 1,
                        }}
                        onPress={() => {
                          this.setState({
                            curCate: cate.id,
                          });
                          // 滚回顶部
                          this.subcateFlatList && this.subcateFlatList.scrollToIndex({
                            index: 0, viewOffset: 0, viewPosition: 0,
                            animated: false,
                          })
                        }}
                      >
                        <Text
                          style={{
                            color: cate.id === curCate ? ThemeColor.primary : ThemeColor.title,
                            fontWeight: cate.id === curCate ? 'bold' : 'normal',
                            fontSize: ThemeSize.title,
                            paddingLeft: 8, paddingRight: 8,
                          }}
                        >{cate.name}</Text>
                      </TouchableOpacity>
                    ))
                  : null
                }
              </ScrollView>
            : <EmptyBlock />
          }
          <FlatList
            ref = {ref => (this.subcateFlatList = ref)}
            data={subcates}
            keyExtractor={(item, index) => `subcate-list-item-${index}`}
            ItemSeparatorComponent={({highlighted}) => (<Divider />)}
            renderItem={({item}) => (
              <ListItem
                chevron
                title={item.name}
                titleStyle={{fontSize: ThemeSize.title, color: ThemeColor.content}}
                onPress={() => {
                  this.props.navigation.push('BaikeList', {subcate: item.id, subcateName: item.name});
                }}
              />
            )}
            ListEmptyComponent={<EmptyBlock />}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
