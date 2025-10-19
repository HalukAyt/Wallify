import React, { useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { WALLPAPERS } from '../data/wallpapers';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../ads/ids';

const { width } = Dimensions.get('window');
const GAP = 8;
const NUM_COLS = 2;
const ITEM_SIZE = (width - GAP * (NUM_COLS + 1)) / NUM_COLS;
const BANNER_H = 60;

// Interstitial reklamı oluştur
const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
  requestNonPersonalizedAdsOnly: false,
});

export default function HomeScreen() {
  const interstitialLoaded = useRef(false);

  useEffect(() => {
    const loadedSub = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitialLoaded.current = true;
    });
    const closedSub = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialLoaded.current = false;
      interstitial.load(); // tekrar yükle
    });
    interstitial.load();

    return () => {
      loadedSub();
      closedSub();
    };
  }, []);

  const handlePress = (itemId: string) => {
    // %50 olasılıkla interstitial göster
    if (interstitialLoaded.current && Math.random() < 0.5) {
      interstitial.show();
    }
    router.push({ pathname: '/detail/[id]', params: { id: itemId } });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // 4. öğeden sonra inline banner
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
        contentContainerStyle={{ padding: GAP, paddingBottom: BANNER_H + 16 }}
        renderItem={renderItem}
      />

      {/* Alt sabit banner */}
      <View style={styles.bannerBottom}>
        <BannerAd
          unitId={AD_UNIT_IDS.bannerBottom}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
          onAdFailedToLoad={(e) => console.log('Bottom banner failed:', e)}
        />
      </View>
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
  bannerBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingBottom: Platform.select({ ios: 8, android: 8 }),
    backgroundColor: '#0b0b0b',
  },
});
