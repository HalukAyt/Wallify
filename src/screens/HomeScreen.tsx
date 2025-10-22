import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../ads/ids';
import { WALLPAPERS } from '../data/wallpapers';

const { width } = Dimensions.get('window');
const GAP = 8;
const NUM_COLS = 2;
const ITEM_SIZE = (width - GAP * (NUM_COLS + 1)) / NUM_COLS;

// Interstitial reklam oluştur
const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
  requestNonPersonalizedAdsOnly: false,
});

export default function HomeScreen() {
  const interstitialLoaded = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadedSub = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitialLoaded.current = true;
    });

    const closedSub = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialLoaded.current = false;
      interstitial.load(); // reklam kapandıktan sonra yeniden yükle
    });

    interstitial.load();

    // Her 60 saniyede bir interstitial göster (hazırsa)
    intervalRef.current = setInterval(() => {
      if (interstitialLoaded.current) {
        interstitial.show();
      }
    }, 60 * 1000); // 1 dakika (60 saniye)

    return () => {
      loadedSub();
      closedSub();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handlePress = (itemId: string) => {
    router.push({ pathname: '/detail/[id]', params: { id: itemId } });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (index === 2) {
      return (
        <View style={styles.inlineBanner}>
          <BannerAd
            unitId={AD_UNIT_IDS.bannerInline}
            size={BannerAdSize.MEDIUM_RECTANGLE}
            requestOptions={{ requestNonPersonalizedAdsOnly: false }}
            onAdFailedToLoad={(e) => console.log('Inline banner failed:', e)}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => handlePress(item.id)}
      >
        <Image source={{ uri: item.thumb ?? item.url }} style={styles.image} resizeMode="cover" />
        {item.title && <Text style={styles.title} numberOfLines={1}>{item.title}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={WALLPAPERS}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLS}
        contentContainerStyle={{ padding: GAP, paddingBottom: 16 }}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  card: {
    width: ITEM_SIZE,
    margin: GAP,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  image: { width: '100%', height: ITEM_SIZE * 1.2 },
  title: { color: 'white', padding: 8, fontWeight: '600' },
  inlineBanner: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
});
