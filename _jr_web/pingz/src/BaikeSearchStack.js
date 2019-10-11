/**
 * 百科搜索页
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, ScrollView, View} from 'react-native';
import {Text, Button, Header, Icon, Image, SearchBar, ListItem} from 'react-native-elements';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ScrollViewPull from './components/ScrollViewPull';
import EmptyBlock from './components/EmptyBlock';
import ServerApi from './server/api';

import {AppTheme, ThemeColor, ThemeSize} from './theme';

export default class BaikeSearchStack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      list: [],

      tagList: [],
    };

    this.loading = false;
  }

  updateSearch = search => {
    this.setState({ search });

    const key = search ? search.trim() : '';

    if (!key) {
      this.setState({
        list: [],
      });
      return;
    }

    this.loading = true;

    ServerApi.baikeSearch({key: search})
      .then((res) => {
        if (res && res.data && res.data.content && res.data.content.length > 0) {
          this.setState({
            list: res.data.content,
          });
        } else {
          this.setState({
            list: [],
          });
        }
        this.loading = false;
      })
      .catch((err) => {
        // console.warn(err);
        this.setState({
          list: [],
        });
        this.loading = false;
      });
  };

  searchMore = () => {
    if (this.loading) {
      return;
    }

    const key = this.state.search ? this.state.search.trim() : '';

    if (!key) {
      return;
    }

    this.loading = true;

    ServerApi.baikeSearch({
      offset: this.state.list.length,
      key,
    })
      .then((res) => {
        if (res && res.data && res.data.content && res.data.content.length > 0) {
          this.setState((preState) => {
            const newArray = preState.list.concat(res.data.content);

            return {
              list: newArray,
            }
          });
        }
        this.loading = false;
      })
      .catch((err) => {
        // console.warn(err);
        this.loading = false;
      });
  }

  render() {
    return (
      <View style={AppTheme.pageContainer}>
        <View
          style={{
            paddingTop: getStatusBarHeight(true),
            backgroundColor: ThemeColor.primary,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 12,
          }}
        >
          <SearchBar
            ref={search => this.search = search}
            placeholder={'输入百科搜索词'}
            onChangeText={this.updateSearch}
            value={this.state.search}
            containerStyle={{
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              borderBottomWidth: 0,
              flex: 1,
            }}
            inputContainerStyle={{
              backgroundColor: ThemeColor.bgBanner,
              borderRadius: 25,
            }}
          />
          <Button
            type={'clear'}
            title={'取消'}
            titleStyle={{color: ThemeColor.bgText}}
            buttonStyle={{
              paddingLeft: 10,
              paddingRight: 10 + 5,
            }}
            containerStyle={{
              backgroundColor: 'transparent',
            }}
            onPress={() => {
                this.props.navigation.goBack();
            }}
          />
        </View>
        <ScrollViewPull
          onScrollEnd={this.searchMore}
        >
          {this.state.list && this.state.list.length > 0
            ? this.state.list.map((item, i) => (
                <ListItem
                  key={`search-list-item-${i}`}
                  chevron
                  title={item.title}
                  containerStyle={{borderBottomWidth: .5}}
                  onPress={() => {
                    this.props.navigation.push('BaikeDetail', {id: item.id});
                  }}
                />
              ))
            : <EmptyBlock content={this.state.search ? '空空如也' : '搜索一下'} />
          }
        </ScrollViewPull>
      </View>
    )
  }
}

const styles = StyleSheet.create({
});
