import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

import HomeScreen from '../src/screens/HomeScreen';
import DetailScreen from '../src/screens/DetailScreen';

export type RootStackParamList = {
  Home: undefined;
  Detail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    const initAds = async () => {
      try {
        // iOS: Kullanıcıdan kişiselleştirme izni iste (ATT)
        const { status } = await requestTrackingPermissionsAsync();
        const trackingAllowed = status === 'granted';

        // Ad istek yapılandırması
        await mobileAds().setRequestConfiguration({
          tagForChildDirectedTreatment: false,
          tagForUnderAgeOfConsent: false,
          maxAdContentRating: MaxAdContentRating.PG,
          testDeviceIdentifiers: ['EMULATOR'],
        });

        // Reklam SDK başlat
        await mobileAds().initialize();

        console.log('Google Mobile Ads initialized ✅');
        console.log('Tracking allowed:', trackingAllowed);
      } catch (error) {
        console.warn('AdMob init error:', error);
      }
    };

    initAds();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Wallpapers' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Önizleme' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
