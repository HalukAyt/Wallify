import { Platform } from 'react-native';


export const ADMOB = {
// Test APP IDs
appId: Platform.select({
ios: 'ca-app-pub-3940256099942544~1458002511',
android: 'ca-app-pub-3940256099942544~3347511713',
})!,
// Test Rewarded IDs (geliştirme için bunları bırak)
rewardedUnitId: Platform.select({
ios: 'ca-app-pub-3940256099942544/1712485313',
android: 'ca-app-pub-3940256099942544/5224354917',
})!,
};