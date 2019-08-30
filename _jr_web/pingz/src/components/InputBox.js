/**
 * 输入组件（可用于评论等输入）
 *
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Dimensions, View, KeyboardAvoidingView, TextInput, TouchableOpacity} from 'react-native';
import {Text, Button, Icon} from 'react-native-elements';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import {ThemeColor, ThemeSize} from '../theme';

const WinWidth = Dimensions.get('window').width;

export default class InputBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputText: '', // 评论输入内容
      inputFocus: false,
    };
  }

  static defaultProps = {
    placeholder: '说点什么',
    inputStaticTips: '我来说两句', // 静态输入框提示
    commitButtonText: '提交', // 提交按钮的文案

    rightIconMenus: [], // 右边按钮组{icon: {name, type, color}, onPress}

    onInputBlur: null, // 输入框失去焦点时
    onInputFocus: null, // 输入框获得焦点时

    onCommit: null, // 提交按钮点击响应
  };

  clearInputText = () => {
    this.refs._InputBox_TextInput.clear();
    this.setState({inputText: ''});
  }

  focusInputText = () => {
    this.refs._InputBox_TextInput.focus();
  }

  blurInputText = () => {
    this.refs._InputBox_TextInput.blur();
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={{backgroundColor: ThemeColor.bg, borderTopWidth: 1, borderTopColor: ThemeColor.border}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={1-getBottomSpace()}
        enabled
      >
        <View
          style={{
            flexDirection: 'row', marginBottom: getBottomSpace(),
            display: this.state.inputFocus ? 'flex' : 'none',
          }}
        >
          <TextInput
            multiline={true}
            ref={'_InputBox_TextInput'}
            maxLength={200}
            clearButtonMode={'while-editing'}
            style={{width: WinWidth - 90, height: 88, padding: 10, margin: 10, marginRight: 0, backgroundColor: ThemeColor.bgBanner}}
            placeholder={this.props.placeholder}
            onChangeText={(text) => this.setState({inputText: text})}
            onBlur={(event) => {
              this.setState({inputFocus: false});

              const inputText = event.nativeEvent.text;
              this.props.onInputBlur && this.props.onInputBlur(inputText);
            }}
            onFocus={() => {
              this.setState({inputFocus: true});
              this.props.onInputFocus && this.props.onInputFocus();
            }}
          />
          <Button
            containerStyle={{flexGrow: 1, paddingTop: 10, paddingBottom: 8, alignItems: 'center'}}
            title={this.props.commitButtonText}
            titleStyle={{fontSize: ThemeSize.content}}
            buttonStyle={{borderRadius: 3, width: 60}}
            onPress={() => {
              const inputText = this.state.inputText;
              this.props.onCommit && this.props.onCommit(inputText);
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            display: this.state.inputFocus ? 'none' : 'flex',
            marginBottom: getBottomSpace(),
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row', flexGrow: 1, justifyContent: 'center', alignItems: 'flex-start',
              backgroundColor: ThemeColor.bgBanner, padding: 10, margin: 10, marginTop: 4, marginBottom: 4,
              borderRadius: 3,
            }}
            onPress={this.focusInputText}
          >
            <Icon
              name={'pencil'}
              type={'font-awesome'}
              size={16}
              containerStyle={{marginRight: 8}}
            />
            <Text style={{
              flexGrow: 1,
              fontSize: ThemeSize.content,
              color: ThemeColor.icon,
              paddingTop: 1,
            }}>{this.props.inputStaticTips}</Text>
          </TouchableOpacity>
          {this.props.rightIconMenus && this.props.rightIconMenus.length > 0
            ? this.props.rightIconMenus.map((item, i) => (
                item.icon && item.icon.name
                  ? <Button
                      key={i}
                      type={'clear'}
                      icon={{
                        name: item.icon.name,
                        type: item.icon.type || 'material',
                        color: item.icon.color || ThemeColor.icon,
                        size: 20,
                      }}
                      iconContainerStyle={{paddingTop: 3}}
                      onPress={item.onPress}
                    />
                  : null
              ))
            : null
          }
        </View>
      </KeyboardAvoidingView>
    );
  }
}
