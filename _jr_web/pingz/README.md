# 「瓶子老师冷知识」客户端

基于 `react-natvie` 实现的「瓶子老师冷知识」客户端。

## 环境搭建

参考：[React Native 中文网：搭建开发环境](https://reactnative.cn/docs/getting-started/)

本项目基于 `react-native` 0.59.55 版本，RN iOS 0.45以上版本开始需要依赖一些第三方编译库，这些库在国内下载都非常困难（一般的翻墙工具都很难下载），因此在编辑之前需要先手动从「百度网盘」上下载一些库到本地，再进行编辑即可。

具体操作参考：[iOS RN 0.45以上版本所需的第三方编译库(boost等)](http://bbs.reactnative.cn/topic/4301/ios-rn-0-45%E4%BB%A5%E4%B8%8A%E7%89%88%E6%9C%AC%E6%89%80%E9%9C%80%E7%9A%84%E7%AC%AC%E4%B8%89%E6%96%B9%E7%BC%96%E8%AF%91%E5%BA%93-boost%E7%AD%89)

## 开发调试

```bash
yarn install
yarn pod-install
yarn pod-update

# ios 平台
react-native run-ios

# android 平台
react-native run-android

# android 平台最终测试（js全部打包进去）
react-native run-android --variant=release
```

`react-native run-ios` 只是运行应用的方式之一。你也可以在 Xcode 中直接运行应用。注意0.60版本之后的Xcode主项目文件是.xcworkspace，不是.xcodeproj。

### 安卓真机调试

首先要确保设备已经成功连接，以下命令可以查看：

```bash
adb devices
```

会输出：

```bash
List of devices attached

"Your device Name" device
```

如果下面的设备列表为空，则表示设备连接失败，要先确保设备连接成功后，才可以进行真机调试。

确保连接成功后，就可以进行以下的编译安装到手机上了：

```bash
react-native run-android

# android 平台最终测试（js全部打包进去）
react-native run-android --variant=release
```
如果最终测试时出现闪退之类的，可以通过调试看看错误日志：

```bash
react-native log-android

# 运行 apk，这时控制台应该能捕获到错误信息
```

### iphone 真机调试

参考文章：[iOS开发者证书申请及应用上线发布详解](https://www.cnblogs.com/ioshe/p/5481456.html)

## 打包

### 别忘了修改版本号

- iOS的，在 `Info.plist` 里，每次推送 App Store 都要修改 `version` 字段
- 安卓的，在 `android/app/build.gradle` 里，修改 `versionCode` 和 `versionName`

### 安卓签名文件

首先要下载签名文件：[]() 路径下的 `android-key-pingz.keystore`。

下载好签名文件后，把它放到源码文件夹 `client/android/app/`。

> 其中签名配置信息在：`client/android/gradle.properties`。

### 安卓打包

这里已经写好了 npm 命令，直接运行即可：`npm run build-android`。

顺利的话，打好的包就放在 `android/app/build/outputs/apk/release/app-release.apk`。

可以通过命令 `npm run install-apk` 把 apk 安装到手机上，当然前提是手机已经连接到电脑上并打开了调试模式。

### iOS 签名文件

签名文件在：[]()

### iOS 打包

首先生成 js 文件：

```bash
npm run bundle-ios
```

将项目由debug状态改成release状态，`Xcode-->Product-->Scheme-->Edit Scheme...`。

clean一下项目，然后编译。

### Xcode 打包 ipa

`Product->Archive` 后，选择 `Distribute App`，然后下一步下一步就好了，参考：[Xcode 10如何打包ipa包？](https://www.jianshu.com/p/0421b3fd2470)

有时候发现自己的 Xcode 上的 `Archive` 菜单为灰色的，不用担心，把左上角的运行设备那里选择到 `Generic iOS Device` 即可。

> 注意：打包发布的时候，别忘了把 release version 改一下。

## 发布上线后，记得 release 代码

发布新版生上线，分支代码 commit 完并 push 到远程后，记得 release 下代码：

```bash
# 第一步，修改 changelog
git changelog

# 第二步，release 代码
git release ios-x.x.x # iOS 版本
git release android-x.x.x # 安卓版本
```

## 附

- [React Native 0.60 新特性](https://juejin.im/post/5d1d7e07e51d4577565367f5)
