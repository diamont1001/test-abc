/**
 * 图片组件：自动获取图片大小
 */

import React, {Component} from 'react';
import {Image, Dimensions} from 'react-native';

const WinWidth = Dimensions.get('window').width;

export default class AutoSizedImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finalSize: {
        width: 0,
        height: 0,
      },
    };
  }

  static defaultProps = {
    maxWidth: WinWidth,
    style: {
    },
    source: {
      uri: '',
    },
  };

  componentDidMount() {
    //avoid repaint if width/height is given
    if (this.props.style.width || this.props.style.height) {
      return;
    }

    // 不限定宽度的话，就取屏幕宽度
    const maxWidth = Math.min(this.props.maxWidth, WinWidth);

    Image.getSize(this.props.source.uri, (w, h) => {
      const finalSize = {
        width: w,
        height: h,
      };
      if (w > maxWidth) {
        finalSize.width = maxWidth;
        const ratio = finalSize.width / w;
        finalSize.height = h * ratio;
      }
      this.setState({
        finalSize,
      });
    });
  }

  render() {
    return(
      <Image
        {...this.props}
        resizeMode={'contain'}
        style={[this.props.style, (this.state.finalSize.width && this.state.finalSize.height) ? this.state.finalSize : null]}
      />
    )
  }
}
