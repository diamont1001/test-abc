/**
 * 文章列表的ITEM
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text, Image} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import moment from 'moment/moment';

import {AppTheme, ThemeColor, ThemeSize} from '../../theme';

const WinWidth = Dimensions.get('window').width;

// 中文支持
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export class ArticleItem extends Component {
  constructor(props) {
    super(props);
  }

  goToDetail() {
    this.props.navigation.push('Webview', {uri: `http://www.25pin.com/article/${this.props.article.id}`});
  }

  render() {
    const {article} = this.props;

    return (
      <TouchableOpacity
        style={{
          marginLeft: ThemeSize.pagePadding,
          marginRight: ThemeSize.pagePadding,
          paddingBottom: 18,
          paddingTop: 18,
          borderBottomColor: ThemeColor.border,
          borderBottomWidth: .5,
          backgroundColor: ThemeColor.bg,
        }}
        activeOpacity={1}
        onPress={() => this.goToDetail()}
      >
        {article && article.images && article.images.length >= 3
          ? <View>
              <View style={{paddingBottom: 10}}>
                <Text
                  ellipsizeMode={'tail'} numberOfLines={2}
                  style={styles.articleTitle}
                >{article.title}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Image style={styles.image3} resizeMode={'cover'} source={{uri: article.images[0]}} />
                <Image style={styles.image3} resizeMode={'cover'} source={{uri: article.images[1]}} />
                <Image style={styles.image3} resizeMode={'cover'} source={{uri: article.images[2]}} />
              </View>
              <View style={{marginTop: 10, flexDirection: 'row'}}>
                {!!article.isTop && <Text style={[styles.textTips, {color: ThemeColor.primary}]}>置顶</Text>}
                {!!article.tagList && article.tagList[0] && article.tagList[0].name && <Text style={styles.textTips}>{article.tagList[0].name}</Text>}
                {!!article.publishTime && <Text style={styles.textTips}>{moment(article.publishTime).fromNow()}</Text>}
              </View>
            </View>
          : article && article.images && article.images.length === 1
          ? <View style={{flexDirection: 'row'}}>
              <View style={{flex: 2, justifyContent: 'space-between'}}>
                <Text
                  ellipsizeMode={'tail'} numberOfLines={2}
                  style={[styles.articleTitle, {paddingRight: 10, alignItems: 'flex-start'}]}
                >{article.title}</Text>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  {!!article.isTop && <Text style={[styles.textTips, {color: ThemeColor.primary}]}>置顶</Text>}
                  {!!article.tagList && article.tagList[0] && article.tagList[0].name && <Text style={styles.textTips}>{article.tagList[0].name}</Text>}
                  {!!article.publishTime && <Text style={styles.textTips}>{moment(article.publishTime).fromNow()}</Text>}
                </View>
              </View>
              <Image
                style={styles.image1}
                resizeMode={'cover'}
                source={{uri: article.images[0]}}
              />
            </View>
          : <View>
              <Text
                ellipsizeMode={'tail'} numberOfLines={2}
                style={styles.articleTitle}
              >{article.title}</Text>
              <View style={{marginTop: 10, flexDirection: 'row'}}>
                {!!article.isTop && <Text style={[styles.textTips, {color: ThemeColor.primary}]}>置顶</Text>}
                {!!article.tagList && article.tagList[0] && article.tagList[0].name && <Text style={styles.textTips}>{article.tagList[0].name}</Text>}
                {!!article.publishTime && <Text style={styles.textTips}>{moment(article.publishTime).fromNow()}</Text>}
              </View>
            </View>
        }
      </TouchableOpacity>
    )
  }
}

const image1Width = Math.min(200, (WinWidth - ThemeSize.pagePadding * 2) * 0.28);
const image1Height = image1Width * 0.65;
const image3Width = (WinWidth - ThemeSize.pagePadding * 2 - 10 * 2) * 0.3333;
const image3Height = image3Width * 0.65;

const styles = StyleSheet.create({
  articleTitle: {
    fontSize: ThemeSize.title,
    color: ThemeColor.content,
    lineHeight: ThemeSize.title * ThemeSize.lineHeight,
  },
  textTips: {
    fontSize: ThemeSize.tips,
    color: ThemeColor.tips,
    lineHeight: ThemeSize.tips + 2,
    marginRight: 12,
  },
  image1: {
    flex: 1,
    width: image1Width,
    height: image1Height,
  },
  image3: {
    width: image3Width,
    height: image3Height,
  }
});

export default withNavigation(ArticleItem);
