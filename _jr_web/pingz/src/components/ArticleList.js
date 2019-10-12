/**
 * 资讯列表页
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import ScrollViewPull from './ScrollViewPull';
import ArticleNavi from './ArticleNavi';
import ArticleItem from './ArticleItem';
import EmptyBlock from './EmptyBlock';
import ServerApi from '../server/api';

import {AppTheme, ThemeColor, ThemeSize} from '../theme';
 
export default class ArticleList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],  // 数据列表

      refreshing: false,  // 列表刷新中
      endLoadingStatus: -2, // 列表触底加载状态（0：加载完，1：加载中，-1：到底了，-2：数据为空不显示）
    }
  }

  static defaultProps = {
    listType: 0,
    tagId: 0,
    containerStyle: null,
  };

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    this.setState({refreshing: true, endLoadingStatus: 1});

    ServerApi.getArticleList({
      listType: this.props.listType,
      tagId: this.props.tagId,
      limit: 20,
    })
      .then((res) => {
        if (res && res.data && res.data.content) {
          this.setState({
            refreshing: false,
            endLoadingStatus: res.data.content.length > 0 ? 0 : -2,
            list: res.data.content,
          });
        } else {
          this.setState({
            refreshing: false,
            endLoadingStatus: -2,
          });
        }
      })
      .catch((err) => {
        // console.warn(err);
        this.setState({
          refreshing: false,
          endLoadingStatus: -2,
        });
      })
  }

  // 请求更多数据列表
  appendList() {
    this.setState({ endLoadingStatus: 1 });

    ServerApi.getArticleList({
      offset: this.state.list.length,
      listType: this.props.listType,
      tagId: this.props.tagId,
      limit: 10,
    })
      .then((res) => {
        if (res && res.data && res.data.content && res.data.content.length > 0) {
          this.setState((preState) => {
            const newArray = preState.list.concat(res.data.content);

            return {
              list: newArray,
            }
          });
          this.setState({ endLoadingStatus: 0 });
          this.props.blogSetBat(res.data.content);
        } else {
          this.setState({ endLoadingStatus: -1 });
        }
      })
      .catch((err) => {
        // console.warn(err);
        this.setState({ endLoadingStatus: 0 });
      });
  }

  render() {
    const {tagId} = this.props;

    return (
      <ScrollViewPull
        style={this.props.containerStyle}
        refreshing={this.state.refreshing} // 是否开始下拉刷新动画
        onRefresh={() => this.refreshList()} // 下拉刷新回调
        endLoadingStatus={this.state.endLoadingStatus}
        onScrollEnd={() => this.appendList()} // 触底回调
      >
        {!tagId && <ArticleNavi />}
        {this.state.list && this.state.list.length > 0
          ? this.state.list.map((item, i) => (
              <ArticleItem key={i} article={item} />
            ))
          : <EmptyBlock />
        }
      </ScrollViewPull>
    );
  }
}

const styles = StyleSheet.create({
});
