/**
 * 收藏列表
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, View, ScrollView, Alert} from 'react-native';
import {Text, Header, Icon, ListItem} from 'react-native-elements';
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
      list: null,

      selectId: -1,
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('_pingz_fav_')
      .then(res => {
        try {
          const list = JSON.parse(res);
          if (typeof list === 'object' && list.length > 0) {
            this.setState({list});
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
      '清空收藏',
      '清空之后所有收藏数据将不能恢复，确认清空吗？',
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
            this.setState({list: null});
          },
        },
      ],
      {cancelable: true},
    );
  }

  onMenuConfirm(index) {
    const selectId = this.state.selectId;
    const selectUrl = this.state.list[selectId] ? this.state.list[selectId].url : '';

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
            preState.list.splice(selectId, 1);

            return {
              list: preState.list,
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
              icon={{name: 'more-horiz'}}
              menus={[
                {
                  title: '清空收藏',
                  onPress: this.clearFavConfirm,
                  disabled: !(this.state.list && this.state.list.length > 0)
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
            title={'收藏'}
            options={['查看文章', '取消收藏', '取消']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => this.onMenuConfirm(index)}
          />
          {this.state.list && this.state.list.length > 0
            ? <View>
                {this.state.list.map((item, i) => (
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
            : <EmptyBlock />
          }
        </ScrollView>
      </View>
    )
  }
}
