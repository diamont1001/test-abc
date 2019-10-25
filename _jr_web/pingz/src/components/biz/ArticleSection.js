/**
 * 资讯列表模块
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import ArticleCard from './ArticleCard';
import SectionHeader from '../SectionHeader';
import ServerApi from '../../server/api';

import { ThemeColor, ThemeSize } from '../../theme';
 
export default class ArticleSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],  // 数据列表

      refreshing: false,  // 列表刷新中
    }
  }

  static defaultProps = {
    listType: 0,
  };

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    this.setState({refreshing: true});

    ServerApi.getArticleList({
      listType: this.props.listType,
      limit: 12,
    })
      .then((res) => {
        if (res && res.data && res.data.content) {
          this.setState({
            refreshing: false,
            list: res.data.content,
          });
        } else {
          this.setState({
            refreshing: false,
          });
        }
      })
      .catch((err) => {
        // console.warn(err);
        this.setState({
          refreshing: false,
        });
      })
  }

  render() {
    return (
      this.state.list && this.state.list.length > 0
      ? <View>
          <SectionHeader title={'最新文章'} route={'Article'} border />
          {this.state.list.map((item, i) => (
            <ArticleCard key={i} article={item} />
          ))}
        </View>
      : null
    );
  }
}

const styles = StyleSheet.create({
});
