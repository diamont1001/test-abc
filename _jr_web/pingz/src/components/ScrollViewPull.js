/**
 * 基于 ScrollView 实现的「上拉刷新」和「触底回调」
 * 
 */

import React from 'react';
import {ScrollView, RefreshControl, View} from 'react-native';
import {Text} from 'react-native-elements';
import PropTypes from 'prop-types';

import {ThemeColor, ThemeSize} from '../theme';
 
class ScrollViewPull extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    style: PropTypes.object, // 样式
    refreshing: PropTypes.bool, // 是否开始下拉刷新动画
    onRefresh: PropTypes.func, // 下拉刷新回调

    endLoadingStatus: PropTypes.number, // 触底加载状态（0：加载完，1：加载中，-1：到底了，-2：数据为空不显示），如果状态自己维护，则不显示传该参数
    onScrollEnd: PropTypes.func, // 触底回调
  };

  onRefresh = () => {
    if (typeof this.props.onRefresh === 'function') {
      this.props.onRefresh();
    }
  };

  // 触底响应
  onScrollEnd = (e) => {
    if (this.props.endLoadingStatus === 1 || this.props.endLoadingStatus === -1 || this.props.endLoadingStatus === -2) {
      console.log('[ScrollViewPull] endLoading or no more content, skip onScrollEnd.');
      return;
    }

    const delta = 1; // 误差值
    const offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    const contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    const oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度

    if (delta + offsetY + oriageScrollHeight >= contentSizeHeight){
      if (typeof this.props.onScrollEnd === 'function') {
        this.props.onScrollEnd();
      }
    }
  }

  render() {
    const {children, refreshing, endLoadingStatus, style} = this.props;

    const endText = endLoadingStatus === -1
      ? '啊欧，到底了╮(￣▽￣")╭'
      : endLoadingStatus === 0
      ? ''
      : '拼命加载中...';

    return (
      <ScrollView
        style = {[{flex:1}, style]}
        showsVerticalScrollIndicator = {false}
        refreshControl = {
          (refreshing !== null && refreshing !== undefined)
            ? <RefreshControl
                refreshing = {refreshing}
                onRefresh = {this.onRefresh}
              />
            : null
        }
        onMomentumScrollEnd = {this.onScrollEnd}
      >
        {children}
        {!refreshing && (endLoadingStatus === 0 || endLoadingStatus === 1 || endLoadingStatus === -1 || endLoadingStatus === -2)
          ? (<View
              style={{
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: endLoadingStatus === 0 ? 'transparent' : ThemeColor.bgBanner,
                display: (endLoadingStatus === 0 || endLoadingStatus === 1 || endLoadingStatus === -1) ? 'flex' : 'none',
              }}
              >
              <Text style={{fontSize: ThemeSize.text, color: ThemeColor.tips}}>{endText}</Text>
            </View>)
          : null
        }
      </ScrollView>
    );
  }
}
 
export default ScrollViewPull;
