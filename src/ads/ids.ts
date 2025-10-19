// src/ads/ids.ts
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

const isDev = __DEV__;

// Her placement için iOS ve Android'de ayrı Unit ID kullanın:
const IOS = {
  bannerBottom: 'ca-app-pub-6213254226131923/2303215422',
  bannerInline: 'ca-app-pub-6213254226131923/9234814650',
  interstitial: 'ca-app-pub-6213254226131923/7423680164',
};

const ANDROID = {
  bannerBottom: 'ca-app-pub-6213254226131923/1547896320',
  bannerInline: 'ca-app-pub-6213254226131923/8736761838',
  interstitial: 'ca-app-pub-6213254226131923/4929378763',
};

// DEV'de Google test ID'lerini kullan (store’a çıkmadan önce PROD id’lerle değişir)
export const AD_UNIT_IDS = {
  bannerBottom: isDev
    ? TestIds.BANNER
    : Platform.select({ ios: IOS.bannerBottom, android: ANDROID.bannerBottom })!,
  bannerInline: isDev
    ? TestIds.BANNER
    : Platform.select({ ios: IOS.bannerInline, android: ANDROID.bannerInline })!,
  interstitial: isDev
    ? TestIds.INTERSTITIAL
    : Platform.select({ ios: IOS.interstitial, android: ANDROID.interstitial })!,
};
