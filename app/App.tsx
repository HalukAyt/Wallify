import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import HomeScreen from '../src/screens/HomeScreen';
import DetailScreen from '../src/screens/DetailScreen';


export type RootStackParamList = {
Home: undefined;
Detail: { id: string };
};


const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
useEffect(() => {
mobileAds()
.setRequestConfiguration({
tagForChildDirectedTreatment: false,
tagForUnderAgeOfConsent: false,
maxAdContentRating: MaxAdContentRating.PG,
testDeviceIdentifiers: ['EMULATOR'],
})
.then(() => mobileAds().initialize());
}, []);


return (
<NavigationContainer>
<Stack.Navigator>
<Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Wallpapers' }} />
<Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Önizleme' }} />
</Stack.Navigator>
</NavigationContainer>
);
}