/**
 * 收藏列表
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, View, ScrollView, Alert} from 'react-native';
import {Text, Header, Icon, ListItem, Divider} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Share from 'react-native-share';
import Toast from 'react-native-root-toast';
import ActionSheet from 'react-native-actionsheet';
import HeaderLeftBack from './components/HeaderLeftBack';
import HeaderCenterText from './components/HeaderCenterText';
import HeaderMenus from './components/HeaderMenus';
import EmptyBlock from './components/EmptyBlock';
import ServerApi from './server/api';

import {AppTheme, ThemeColor, ThemeSize} from './theme';

export default class FavListStack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articleList: null,
      baikeList: null,

      selectId: -1,

      tab: 0,
    }

    this.tab = this.props.navigation.getParam('tab', 0); // 0：文章收藏 ，1：百科收藏
  }

  componentDidMount() {
    this.setState({
      tab: this.tab,
    });

    AsyncStorage.getItem('_pingz_fav_')
      .then(res => {
        try {
          const articleList = JSON.parse(res);
          if (typeof articleList === 'object' && articleList.length > 0) {
            this.setState({articleList});
          }
        } catch (e) {
          console.warn(e);
        }
      })
      .catch(err => {
        console.warn(err);
      });

    AsyncStorage.getItem('_pingz_baike_fav_')
      .then(res => {
        try {
          const baikeList = JSON.parse(res);
          if (typeof baikeList === 'object' && baikeList.length > 0) {
            this.setState({baikeList});
          }
        } catch (e) {
          console.warn(e);
        }
      })
      .catch(err => {
        console.warn(err);
      });
  }

  // 清空所有收藏
  clearFavConfirm = () => {
    Alert.alert(
      '清空文章收藏',
      '清空之后所有收藏的文章数据将不能恢复，确认清空吗？',
      [
        {
          text: '我再想想',
          onPress: () => {
            console.log('取消')
          },
          style: 'Cancel',
        },
        {
          text: '确认清空',
          onPress: () => {
            ServerApi.favClear();
            this.setState({articleList: null});
          },
        },
      ],
      {cancelable: true},
    );
  }

  // 清空所有收藏
  clearFavConfirmBaike = () => {
    Alert.alert(
      '清空百科收藏',
      '清空之后所有收藏的百科数据将不能恢复，确认清空吗？',
      [
        {
          text: '我再想想',
          onPress: () => {
            console.log('取消')
          },
          style: 'Cancel',
        },
        {
          text: '确认清空',
          onPress: () => {
            ServerApi.baikeFavClear();
            this.setState({baikeList: null});
          },
        },
      ],
      {cancelable: true},
    );
  }

  onMenuConfirm(index) {
    const selectId = this.state.selectId;
    const selectUrl = this.state.articleList[selectId] ? this.state.articleList[selectId].url : '';

    this.setState({selectId: -1});

    if (index < 0 || index > 1 || selectId < 0) {
      return;
    }

    if (index === 0 && selectUrl) {
      // 查询文章
      this.props.navigation.push('Webview', {uri: selectUrl})
    } else if (index === 1) {
      // 取消收藏
      ServerApi.favDelete({url: selectUrl})
        .then((res) => {
          this.setState((preState) => {
            preState.articleList.splice(selectId, 1);

            return {
              articleList: preState.articleList,
            }
          });
          Toast.show('已取消收藏');
        })
        .catch((err) => {
          // console.warn(err);
          err && err.message && Toast.show(err.message);
        });
    }
  }

  onMenuConfirmBaike(index) {
    const selectId = this.state.selectId;
    const selectBaikeId = this.state.baikeList[selectId] ? this.state.baikeList[selectId].id : '';

    this.setState({selectBaikeId: -1});

    if (index < 0 || index > 1 || selectBaikeId < 0) {
      return;
    }

    if (index === 0 && selectBaikeId) {
      // 查看百科详情
      this.props.navigation.push('BaikeDetail', {id: selectBaikeId})
    } else if (index === 1) {
      // 取消收藏
      ServerApi.baikeFavDelete({id: selectBaikeId})
        .then((res) => {
          this.setState((preState) => {
            preState.baikeList.splice(selectId, 1);

            return {
              baikeList: preState.baikeList,
            }
          });
          Toast.show('已取消收藏');
        })
        .catch((err) => {
          // console.warn(err);
          err && err.message && Toast.show(err.message);
        });
    }
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <StatusBar barStyle="dark-content" />
        <Header
          leftComponent={<HeaderLeftBack/>}
          centerComponent={<HeaderCenterText text={'我的收藏'}/>}
          rightComponent={
            <HeaderMenus
              icon={{name: 'options'}}
              menus={[
                {
                  title: '清空文章收藏',
                  onPress: this.clearFavConfirm,
                  disabled: !(this.state.articleList && this.state.articleList.length > 0)
                },
                {
                  title: '清空百科收藏',
                  onPress: this.onMenuConfirmBaike,
                  disabled: !(this.state.baikeList && this.state.baikeList.length > 0)
                },
              ]}
            />
          }
        />
        <ScrollView
          style={{padding: ThemeSize.pagePadding}}
        >
          <ActionSheet
            ref={ref => this.ActionSheet = ref}
            title={'文章收藏'}
            options={['查看文章详情', '取消收藏', '取消']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => this.onMenuConfirm(index)}
          />
          <ActionSheet
            ref={ref => this.ActionSheetBaike = ref}
            title={'百科收藏'}
            options={['查看百科详情', '取消收藏', '取消']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => this.onMenuConfirmBaike(index)}
          />
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: ThemeColor.bgBanner,
            }}
          >
            <Text
              style={{
                color: this.state.tab === 1 ? ThemeColor.content : ThemeColor.primary,
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                paddingTop: 12,
                paddingBottom: 12,
                fontSize: ThemeSize.title,
              }}
              onPress={() => {
                this.setState({tab: 0});
              }}
            >文章收藏</Text>
            <Text
              style={{
                paddingTop: 12,
                paddingBottom: 12,
                color: ThemeColor.tips,
              }}
            >|</Text>
            <Text
              style={{
                color: this.state.tab === 1 ? ThemeColor.primary : ThemeColor.content,
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                paddingTop: 12,
                paddingBottom: 12,
                fontSize: ThemeSize.title,
              }}
              onPress={() => {
                this.setState({tab: 1});
              }}
            >百科收藏</Text>
          </View>
          {this.state.tab === 0 && this.state.articleList && this.state.articleList.length > 0
            ? <View>
                {this.state.articleList.map((item, i) => (
                  <ListItem
                    chevron
                    key={`fav-list-item-${i}`}
                    title={item.title}
                    titleStyle={{fontSize: ThemeSize.title}}
                    containerStyle={{borderBottomWidth: .5, borderBottomColor: ThemeColor.border}}
                    onPress={() => {
                      this.setState({selectId: i});
                      this.ActionSheet.show();
                    }}
                  />
                ))}
              </View>
            : this.state.tab === 1 && this.state.baikeList && this.state.baikeList.length > 0
            ? <View>
                {this.state.baikeList.map((item, i) => (
                  <ListItem
                    chevron
                    key={`fav-list-item-${item.id}`}
                    title={item.title}
                    titleStyle={{fontSize: ThemeSize.title}}
                    containerStyle={{borderBottomWidth: .5, borderBottomColor: ThemeColor.border}}
                    onPress={() => {
                      this.setState({selectId: i});
                      this.ActionSheetBaike.show();
                    }}
                  />
                ))}
              </View>
            : <EmptyBlock />
          }
        </ScrollView>
      </View>
    )
  }
}
