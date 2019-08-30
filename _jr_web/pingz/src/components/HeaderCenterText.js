/**
 * 头部中间文字
 * 
 */

import React, {Component} from 'react';
import {Text} from 'react-native-elements';

import {ThemeColor, ThemeSize} from '../theme';

export default class HeaderCenterText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {text} = this.props;

    return (
      text
      ? (<Text
          style={{color: ThemeColor.bgText, fontSize: ThemeSize.title}}
          ellipsizeMode={'tail'}
          numberOfLines={1}
        >{text}</Text>)
      : null
    );
  }
}
