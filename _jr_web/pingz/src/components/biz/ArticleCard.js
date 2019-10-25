/**
 * 文章卡片
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text, Image, Card} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import moment from 'moment/moment';

import {AppTheme, ThemeColor, ThemeSize} from '../../theme';

const WinWidth = Dimensions.get('window').width;

// 中文支持
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export class ArticleCard extends Component {
  constructor(props) {
    super(props);
  }

  goToDetail() {
    this.props.navigation.push('Webview', {uri: `http://www.25pin.com/article/${this.props.article.id}`});
  }

  render() {
    const {article} = this.props;

    return (
      article
        ? <Card>
            <TouchableOpacity
              // activeOpacity={1}
              onPress={() => this.goToDetail()}
            >
              <View>
                <Text
                  ellipsizeMode={'tail'} numberOfLines={2}
                  style={styles.articleTitle}
                >{article.title}</Text>
                {article.images && article.images.length === 1
                  ?  <Image
                      style={styles.image}
                      resizeMode={'cover'}
                      source={{uri: article.images[0]}}
                    />
                  : null
                }
                <View style={{marginTop: 10, flexDirection: 'row'}}>
                  {!!article.isTop && <Text style={[styles.textTips, {color: ThemeColor.primary}]}>置顶</Text>}
                  {!!article.tagList && article.tagList[0] && article.tagList[0].name && <Text style={styles.textTips}>{article.tagList[0].name}</Text>}
                  {!!article.publishTime && <Text style={styles.textTips}>{moment(article.publishTime).fromNow()}</Text>}
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        : null
    )
  }
}

const imageWidth = WinWidth - ThemeSize.pagePadding * 4;
const imageHeight = imageWidth * 0.618;

const styles = StyleSheet.create({
  articleTitle: {
    fontSize: ThemeSize.title,
    color: ThemeColor.title,
    lineHeight: ThemeSize.title * ThemeSize.lineHeight,
  },
  textTips: {
    fontSize: ThemeSize.tips,
    color: ThemeColor.tips,
    lineHeight: ThemeSize.tips + 2,
    marginRight: 12,
  },
  image: {
    flex: 1,
    width: imageWidth,
    height: imageHeight,
    marginTop: ThemeSize.pagePadding,
  },
});

export default withNavigation(ArticleCard);
