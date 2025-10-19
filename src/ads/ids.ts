// src/ads/ids.ts
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

const isDev = __DEV__;

// Her placement için iOS ve Android'de ayrı Unit ID kullanın:
const IOS = {
  bannerBottom: 'ca-app-pub-xxxxxxxxxxxxxxxx/iosBottomBannerId',
  bannerInline: 'ca-app-pub-xxxxxxxxxxxxxxxx/iosInlineBannerId',
  interstitial: 'ca-app-pub-xxxxxxxxxxxxxxxx/iosInterstitialId',
};

const ANDROID = {
  bannerBottom: 'ca-app-pub-xxxxxxxxxxxxxxxx/androidBottomBannerId',
  bannerInline: 'ca-app-pub-xxxxxxxxxxxxxxxx/androidInlineBannerId',
  interstitial: 'ca-app-pub-xxxxxxxxxxxxxxxx/androidInterstitialId',
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
