import React, { useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from "../../app/App";
import { WALLPAPERS } from '../data/wallpapers';
import { ADMOB } from '../admob';
import { RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import { saveImageFromUrl } from '../utils/save';
import { Alert, TouchableOpacity, View, Image, ActivityIndicator, Text, Dimensions, StyleSheet } from 'react-native';


type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;


export default function DetailScreen({ route }: Props) {
const paper = WALLPAPERS.find(w => w.id === route.params.id)!;
const [adLoaded, setAdLoaded] = useState(false);
const [adShowing, setAdShowing] = useState(false);
const [downloading, setDownloading] = useState(false);


const rewarded = useMemo(
() => RewardedAd.createForAdRequest(ADMOB.rewardedUnitId, { requestNonPersonalizedAdsOnly: true }),
[]
);


useEffect(() => {
const onLoaded = rewarded.addAdEventListener(AdEventType.LOADED, () => setAdLoaded(true));
const onError = rewarded.addAdEventListener(AdEventType.ERROR, (err) => {
setAdLoaded(false);
Alert.alert('Reklam Hatası', err?.message ?? 'Yüklenemedi');
});
const onReward = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
try {
setDownloading(true);
await saveImageFromUrl(paper.url, paper.fileName ?? `${paper.id}.jpg`);
Alert.alert('Tamam!', 'Wallpaper galeriye kaydedildi 📸');
} catch (e: any) {
Alert.alert('İndirme Hatası', e?.message ?? 'Kaydedilemedi');
} finally {
setDownloading(false);
}
});


rewarded.load();
return () => { onLoaded(); onError(); onReward(); };
}, [rewarded, paper.fileName, paper.id, paper.url]);


const onPressWatchAndDownload = () => {
if (!adLoaded) {
rewarded.load();
Alert.alert('Hazırlanıyor', 'Reklam yükleniyor, lütfen tekrar deneyin.');
return;
}
setAdShowing(true);
rewarded.show().finally(() => setAdShowing(false));
};


return (
<View style={styles.container}>
<Image source={{ uri: paper.url }} style={styles.image} resizeMode="cover" />
<TouchableOpacity
style={[styles.button, (adShowing || downloading) && { opacity: 0.6 }]}
disabled={adShowing || downloading}
onPress={onPressWatchAndDownload}
activeOpacity={0.85}
>
{adShowing || downloading ? (
<ActivityIndicator size="small" />
) : (
<Text style={styles.buttonText}>Reklam İzle ve İndir</Text>
)}
</TouchableOpacity>
<Text style={styles.note}>İndirme, ödül kazanınca otomatik başlar.</Text>
</View>
);
}


const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: 'black', justifyContent: 'flex-end' },
image: { ...StyleSheet.absoluteFillObject, width, height },
button: {
margin: 16, paddingVertical: 14, borderRadius: 12,
backgroundColor: '#ffffff22', borderWidth: 1, borderColor: '#ffffff55',
alignItems: 'center'
},
buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
note: { color: '#bbb', textAlign: 'center', marginBottom: 24 },
});