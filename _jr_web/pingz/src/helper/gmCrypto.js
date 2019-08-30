/**
 * 加密算法
 */

/* global define */
/* eslint-disable no-var */

const gmCrypto = {};
const base64 = _base64Init();
const _sSecret = 'pingz@25pin.com';

/**
 * @GM异或加密函数
 * @param sTxt string 要加密的字符串
 * @param sSecret string 要使用的加密密钥(要记住,不然就解不了密啦)
 * @retrun string 加密后的字符串
 * */
gmCrypto.xorEncode = function(sTxt, sSecret) {
  var sTmp1 = '', sTmp2 = '', i, j;
  sSecret = sSecret || _sSecret;

  try {
    for(i=0; i<sTxt.length; i++) {
      sTmp2 = String.fromCharCode(sTxt.charCodeAt(i) ^ sSecret.charCodeAt(0));
      for(j=1; j<sSecret.length; j++) {
        sTmp2 = String.fromCharCode(sTmp2.charCodeAt(0) ^ sSecret.charCodeAt(j));
      }
      sTmp1 += sTmp2;
    }
    return base64.encode(sTmp1);
  } catch {
    return '';
  }
};

/**
 * @GM异或解密函数
 * @param sTxt string 要解密的字符串
 * @param sSecret string 要使用的解密密钥(要记住,不然就解不了密啦)
 * @retrun string 解密后的字符串
 * */
gmCrypto.xorDecode = function(sTxt, sSecret) {
  var sTmp1 = '', sTmp2 = '', i, j;
  sSecret = sSecret || _sSecret;
  try {
    sTxt = base64.decode(sTxt);

    for(i=0; i<sTxt.length; i++) {
      sTmp2 = String.fromCharCode(sTxt.charCodeAt(i) ^ sSecret.charCodeAt(0));
      for(j=sSecret.length-1; j>0; j--) {
        sTmp2 = String.fromCharCode(sTmp2.charCodeAt(0) ^ sSecret.charCodeAt(j));
      }
      sTmp1 += sTmp2;
    }

    return sTmp1;
  } catch {
    return  '';
  }
};

function _base64Init(ec, dc) {
    var encodeChars = ec || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        decodeChars = dc || [ -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1 ];
    /**
     * base64编码
     * @param {Object} str
     */
    function base64encode(str){
        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += encodeChars.charAt(c1 >> 2);
                out += encodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += encodeChars.charAt(c1 >> 2);
                out += encodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += encodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += encodeChars.charAt(c1 >> 2);
            out += encodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += encodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += encodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }
    /**
     * base64解码
     * @param {Object} str
     */
    function base64decode(str){
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = decodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c1 == -1);
            if (c1 == -1) break;
            /* c2 */
            do {
                c2 = decodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c2 == -1);
            if (c2 == -1) break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61) return out;
                c3 = decodeChars[c3];
            }
            while (i < len && c3 == -1);
            if (c3 == -1) break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return out;
                c4 = decodeChars[c4];
            }
            while (i < len && c4 == -1);
            if (c4 == -1) break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }
    /**
     * utf16转utf8
     * @param {Object} str
     */
    function utf16to8(str){
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            }
            else
                if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
                else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
        }
        return out;
    }
    /**
     * utf8转utf16
     * @param {Object} str
     */
    function utf8to16(str){
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += str.charAt(i - 1);
                    break;
                case 12:
                case 13:
                    // 110x xxxx 10xx xxxx
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx10xx xxxx10xx xxxx
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                    break;
                default:
                    break;
            }
        }
        return out;
    }

    return {
        encode: function(str) { return base64encode(utf16to8(str + '')); },
        decode: function(str) { return utf8to16(base64decode(str)); },
        base64encode: base64encode,
        base64decode: base64decode,
        utf8to16: utf8to16,
        utf16to8: utf16to8,
    }
}

module.exports = gmCrypto;
/* eslint-enable no-var */
