import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WALLPAPERS } from '../../src/data/wallpapers';
import { ADMOB } from '../../src/admob';
import { RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import { saveImageFromUrl } from '../../src/utils/save';

export default function DetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const paper = WALLPAPERS.find((w) => w.id === id);

  const [adLoaded, setAdLoaded] = useState(false);
  const [adShowing, setAdShowing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // RewardedAd örneğini bir kez oluştur
  const rewarded = useMemo(
    () => RewardedAd.createForAdRequest(ADMOB.rewardedUnitId, { requestNonPersonalizedAdsOnly: true }),
    []
  );

  useEffect(() => {
    if (!paper) return;

    const unsubLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setAdLoaded(true);
    });

    // bazı sürümlerde OPENED/CLOSED RewardedAdEventType altında yok; CLOSED için AdEventType kullanılır
    const unsubClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      // tekrar yükleyerek bir sonraki tıklamada hazır tut
      rewarded.load();
    });

    const unsubError = rewarded.addAdEventListener(AdEventType.ERROR, (err) => {
      setAdLoaded(false);
      Alert.alert('Reklam Hatası', err?.message ?? 'Yüklenemedi');
    });

    const unsubReward = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
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

    return () => {
      unsubLoaded();
      unsubClosed();
      unsubError();
      unsubReward();
    };
  }, [rewarded, paper]);

  if (!paper) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#fff' }}>Bulunamadı</Text>
      </View>
    );
  }

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
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff22',
    borderWidth: 1,
    borderColor: '#ffffff55',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
  note: { color: '#bbb', textAlign: 'center', marginBottom: 24 },
});
