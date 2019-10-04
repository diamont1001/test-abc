/**
 * 百科
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, ScrollView, View, TouchableOpacity} from 'react-native';
import {Text, Button, Header, Icon, Image, ListItem} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import ArticleList from './components/ArticleList';
import HeaderIcon from './components/HeaderIcon';
import HeaderCenterText from './components/HeaderCenterText';
import HeaderMenus from './components/HeaderMenus';
import EmptyBlock from './components/EmptyBlock';
import ServerApi from './server/api';

import {AppTheme, ThemeColor, ThemeSize} from './theme';

export default class ArticleListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cateList: [], // 百科一级分类列表
      subcateList: [], // 百科二级分类列表
      curCate: 0,
    }
  }

  async componentDidMount() {
    await this.fetchBaikeCateList();
    await this.fetchBaikeSubcateList();
  }

  // 百科一级分类数据
  fetchBaikeCateList() {
    ServerApi.baikeCateList()
      .then((res) => {
        if (res && res.data && res.data.content) {
          this.setState({
            cateList: res.data.content,
            curCate: res.data.content.length > 0 ? res.data.content[0].id : 0,
          });
        }
      })
      .catch((err) => {
        // console.warn(err);
      })
  }

  fetchBaikeSubcateList() {
    ServerApi.baikeSubcateList()
      .then((res) => {
        if (res && res.data && res.data.content) {
          this.setState({
            subcateList: res.data.content,
          });
        }
      })
      .catch((err) => {
        // console.warn(err);
      })
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <Header
          leftComponent={<HeaderIcon icon={{name: 'search1', type: 'antdesign'}} route={'ArticleSearch'}/>}
          centerComponent = {<HeaderCenterText text={'百科'}/>}
          rightComponent={
            <HeaderMenus
              icon={{name: 'options'}}
              menus={[
                {
                  title: '百科收藏',
                  route: 'FavList',
                },
                {
                  title: '设置',
                  route: 'Settings',
                },
                {
                  title: '关于',
                  route: 'About',
                },
              ]}
            />
          }
        />
        <ScrollView
          style={{
            flexGrow: 0,
            paddingLeft: 7,
            paddingRight: 7,
            paddingBottom: 2,
            backgroundColor: ThemeColor.bgBanner,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {this.state.cateList && this.state.cateList.length > 0
            ? this.state.cateList.map((cate, i) => (
                <TouchableOpacity
                  key={`${cate.id}`}
                  activeOpacity={1}
                  style={{
                    borderBottomWidth: 2,
                    borderBottomColor: cate.id === this.state.curCate ? ThemeColor.primary : ThemeColor.bgBanner,
                  }}
                  onPress={() => {
                    this.setState({
                      curCate: cate.id,
                    })
                  }}
                >
                  <Text
                    style={{
                      color: cate.id === this.state.curCate ? ThemeColor.primary : ThemeColor.title,
                      fontSize: ThemeSize.title, paddingTop: 12, paddingBottom: 12, paddingLeft: 8, paddingRight: 8,
                    }}
                  >{cate.name}</Text>
                </TouchableOpacity>
              ))
            : null
          }
        </ScrollView>
        <ScrollView
          style={{
          }}
        >
          {this.state.subcateList && this.state.subcateList.length > 0
            ? this.state.subcateList.filter((item) => {
                return item.cate === this.state.curCate;
              })
              .map((subcate, i) => (
                <ListItem
                  key={subcate.id}
                  chevron
                  title={subcate.name}
                  // titleStyle={{fontSize: ThemeSize.content + 1}}
                  containerStyle={{borderBottomWidth: .5, borderBottomColor: ThemeColor.border}}
                  onPress={() => {
                    this.props.navigation.push('BaikeList', {subcate: subcate.id, subcateName: subcate.name});
                  }}
                />
              ))
            : null
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
