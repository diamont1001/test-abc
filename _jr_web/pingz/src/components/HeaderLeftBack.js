/**
 * 头部左边的返回按钮
 * 
 */

import React, {Component} from 'react';
import {Icon, Button} from 'react-native-elements';
import {withNavigation} from 'react-navigation';

import {ThemeColor} from '../theme';

export class HeaderLeftBack extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {onGoBack, title} = this.props;

    return (
      !title
        ? <Icon
            name={'arrow-left'}
            iconStyle={{paddingRight: 10, color: ThemeColor.bgText}}
            onPress={() => {
              if (onGoBack) {
                onGoBack();
              } else {
                this.props.navigation.goBack();
              }
            }}
          />
        : <Button
            type={'clear'}
            title={typeof title === 'string' ? title : '返回'}
            titleStyle={{color: ThemeColor.bgText}}
            icon={{name: 'arrow-left', color: ThemeColor.bgText}}
            buttonStyle={{
              paddingLeft: 0,
            }}
            containerStyle={{
              backgroundColor: 'transparent',
            }}
            onPress={() => {
              if (onGoBack) {
                onGoBack();
              } else {
                this.props.navigation.goBack();
              }
            }}
          />
    );
  }
}

export default withNavigation(HeaderLeftBack);