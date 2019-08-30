/**
 * 应用主题
 * 
 * 定义一些全局的样式
 * 
 */

import {Platform, StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export const ThemeColor = {
  primary: '#2BB2BC', // 主色调 #4bde77
  bgText: 'snow', // 主色调上的文字颜色
  bg: 'white', // 页面常规背景颜色
  // bg: '#F5FCFF', // 页面常规背景颜色
  bgBanner: '#F7F7F7', // 页头页尾背景颜色
  text: '#353535', // 普通文字颜色
  tips: '#b2b2b2', // Tips 文字颜色
  border: '#efefef', // Border颜色
  icon: '#888', // icon颜色
  description: '#969696', // 描述文字颜色
  link: 'deepskyblue', // 链接颜色
  heart: '#e64340', // 红心的颜色
};

export const ThemeSize = {
  title: 16,
  content: 14,
  description: 13,
  tips: 12,

  pagePadding: 15, // 页面的统一 padding
  lineHeight: 1.5, // 文字行距基数（RN里 lineHeight 要乘以字体实际大小）
};

export const HeaderHeight = Platform.select({
    android: 56,
    default: 44,
  }) + getStatusBarHeight(true);

// UI主题
// 后面可以使用 updateTheme 来更新主题
// @links https://react-native-training.github.io/react-native-elements/docs/customization.html
export const ElementsTheme = {
  colors: {
    primary: ThemeColor.primary,
    // secondary: 'pink',
    divider: ThemeColor.border,
  },
  Text: {
    style: {
      color: ThemeColor.text,
      fontSize: ThemeSize.content,
    },
    h1Style: {
      fontSize: 32,
      color: ThemeColor.primary,
    },
    h2Style: {
      fontSize: 28,
      color: ThemeColor.text,
    },
    h3Style: {
      fontSize: 26,
      color: ThemeColor.text,
    },
    h4Style: {
      fontSize: 24,
      color: ThemeColor.text,
    },
  },
  Header: {
    barStyle: 'light-content',
    statusBarProps: {
      backgroundColor: ThemeColor.primary,
      translucent: false, // 浮层
    },
    containerStyle: {
      borderBottomWidth: 0,
      backgroundColor: ThemeColor.primary,
      height: HeaderHeight,
      paddingTop: getStatusBarHeight(true),
      // paddingTop:
      //   Platform.select({ 
      //     android: 0,
      //     default: getStatusBarHeight(),
      //   }),
    },
  },
  Button: {
    titleStyle: {
      fontSize: 16,
    }
  },
  Icon: {
    color: ThemeColor.icon,
    underlayColor: 'transparent',
  },
  ListItem: {
    containerStyle: {
      backgroundColor: ThemeColor.bg,
    }
  },
  Divider: {
    style: {
      backgroundColor: ThemeColor.border,
    }
  },
  Image: {
    style: {
      borderRadius: 5,
    }
  },
  Input: {
    inputStyle: {
      color: ThemeColor.text,
      fontSize: ThemeSize.content,
    }
  },
};

export const AppTheme = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: ThemeColor.bg,
  },
});