/**
 * 百科二级分类列表（只显示N行）
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import {Text, ListItem, Card} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import SectionHeader from '../SectionHeader';
import ServerApi from '../../server/api';

import {AppTheme, ThemeColor, ThemeSize} from '../../theme';

const WinWidth = Dimensions.get('window').width;
 
export class BaikeSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curCate: 19,  // 要显示的一级分类的数据
      subcateList: [], // 百科二级分类列表
    };

    // 精选出来的百科内容，前置显示
    this.baikeDemo = [
      {
        id: 10024441,
        title: '过期牛奶做面膜好吗',
        content: '过期牛奶可以做面膜。过期的纯牛奶和新鲜纯牛奶比较，过期牛奶会产生乳酸，这属于果酸的一种，可以软化角质，具有保湿的作用。过期的牛奶可以用来做面膜滋润皮肤，起到美容作用。牛奶内含有大量蛋白质、维生素、微量元素，用来涂抹皮肤可以有效改善干燥、无光泽现象。短时间内过期的牛奶不会发生剧烈变质现象，只是有效的营养成分较少或分解经皮肤吸收，是没有毒副作用的。不过要注意的是，短时间的过期牛奶是可以用的，不过过期久了的最好不要用。如果过期的牛奶如果已经结块，就不要使用来做牛奶面膜，因为乳酸不会结块，会结块的是牛奶蛋白，对于去角质或是保湿没有效果，还会产生大量细菌。',
      },
      {
        id: 10045360,
        title: '新装修的房子多久可以入住',
        content: '新装修的房子，如果通风做的好的话，至少也要2-3个月。这是因为装修后屋子有很多的甲醛，这些有毒物质会损害人体健康，容易造成呼吸道疾病，不孕不育，白血病等疾病。正常人在2-3个月就能入住。孕妇则越晚就越好，至少也要三个月以上，尤其是刚怀孕的三个月，前三个月是宝宝最不稳定的时候，有毒污染物质对大人小孩的身体都不好，最好在半年以后，如果没有那么多时间等，最好每天都开下窗户，放一些芦荟、活性炭等容易吸收有毒气体的东西，对怀孕的人来说，各方面都要注意，毕竟对胎儿是非常有影响的，所以刚装修过的房子尽量晚一些住进去。新装修的房子婴儿入住的话最好放在6个月以后比较好。装修后建议做好通风，门窗都要打开，建议多放一些绿色植物，最好买一台空气净化器，儿童入住的话建议在半年以后入住比较适宜。',
      },
      {
        id: 10053959,
        title: '安检对孕妇有害吗',
        content: '到目前为止，医学上还没有安检对孕妇和胎儿造成不良影响的报道。同时，安检仪的辐射数值实际上很低，对身体的影响也接近为零。因此，孕妇经过安检机时，不会对腹内宝宝产生影响与伤害。另外，生活中常见的一些辐射，比如电脑辐射、微波炉辐射等，对孕妇和胎儿的影响也微乎其微，孕妈妈们不必过于担心。',
      },
      {
        id: 10032646,
        title: '睡觉流口水是怎么回事',
        content: '一般6个月～3岁流口水较常见，大部分是正常现象。新生儿流口水是很少见的。因为新生儿的唾液腺不发达，唾液分泌很少，3～4个月开始唾液分泌增多，6个月后由于饮食转变，刺激神经引起唾液分泌增加，才开始发生流口水现象。且婴儿口腔浅，不会调节口内过多的液体，因而就发生流口水现象。随着年龄的增长，牙齿萌出，口腔深度增加，婴幼儿逐渐学会以吞咽来凋节过多的唾液，这种流口水现象就逐渐消失。以上流口水是正常现象。但有的小儿流口水同时哭闹不安，拒食，进食时哭闹加重，或伴有发热现象，这时应仔细检查一下口腔粘膜即舌尖部，颊部、唇部有无溃疡。溃疡可引起疼痛及唾液分泌增加以致流口水，应抓紧治疗。有的流口水是由脑炎后遗症、面神经麻痹及呆小病而致调节唾液分泌功能、吞咽功能失调引起的，则应去医院明确诊断进行治疗。',
      },
    ];
  }

  async componentDidMount() {
    await this.getBaikeSubcateFromLocal();
    await this.fetchBaikeSubcateList();
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
    const subcates = this.state.subcateList.filter((item) => {
      return item.cate === this.state.curCate;
    });
    subcates.length = Math.min(5, subcates.length); // 最多取N个数

    return (
      <View>
        <SectionHeader title={'百科精选'} route={'Baike'} border />
        {this.baikeDemo && this.baikeDemo.length > 0
          ? <View style={{marginBottom: ThemeSize.pagePadding}}>
              {this.baikeDemo.map((item, i) => (
                <Card
                  key={`baike-demo-item-${i}`}
                  containerStyle={{}}
                >
                  <TouchableOpacity
                    // activeOpacity={1}
                    onPress={() => {
                      this.props.navigation.push('BaikeDetail', {id: item.id});
                    }}
                  >
                    <Text style={{fontSize: ThemeSize.title, color: ThemeColor.title}}>{item.title}</Text>
                    <Text
                      ellipsizeMode={'tail'} numberOfLines={5}
                      style={{fontSize: ThemeSize.content, color: ThemeColor.content, marginTop: ThemeSize.pagePadding, lineHeight: ThemeSize.content * ThemeSize.lineHeight}}
                    >{item.content}</Text>
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          : null
        }
        {subcates && subcates.length > 0
          ? <View
              style={{
                paddingLeft: ThemeSize.pagePadding,
                paddingRight: ThemeSize.pagePadding,
                paddingBottom: ThemeSize.pagePadding,
              }}
            >
              {subcates.map((item, i) => (
                <ListItem
                  key={`baike-navi-subcate-item-${item.id}`}
                  chevron
                  title={item.name}
                  titleStyle={{color: ThemeColor.content, fontSize: ThemeSize.title}}
                  onPress={() => {
                    this.props.navigation.push('BaikeList', {subcate: item.id, subcateName: item.name});
                  }}
                />
              ))}
            </View>
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

export default withNavigation(BaikeSection);
