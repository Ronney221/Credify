import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';

// Placeholder for app logo - replace with your actual logo
// const AppLogo = require('../assets/images/app-logo.png');

export default function AuthScreen() {
  const router = useRouter();
  // const params = useLocalSearchParams ...; // Not needed in AuthScreen for the current flow

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
    }, [])
  );

  const handleLoginPress = () => {
    console.log('Login/Sign Up button pressed, navigating to Card Selection.');
    router.push('/card-selection');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.content}>
        {/* App Logo Placeholder */}
        {/* <Image source={AppLogo} style={styles.logo} /> */}
        <Text style={styles.appTitle}>Credify</Text>
        <Text style={styles.tagline}>Your Credit Card Companion</Text>

        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress} activeOpacity={0.8}>
          <Text style={styles.loginButtonText}>Log In / Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 60, // Increased space before button
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#007aff', // Consistent with previous button style
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%', // Make button take full width of content area
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
}); 