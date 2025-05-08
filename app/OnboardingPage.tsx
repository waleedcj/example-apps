import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Onboarding from '@/components/ui/Onboarding';
import { useAppColors } from '@/hooks/useAppColors';

// Define or import your onboarding data
const AppOnboardingData = [
    {
        id: '1',
        title: 'Find Your Spare Parts, Fast',
        description: 'Browse a vast catalog of auto spare parts for your vehicle. Select parts based on your car’s make and model, whether you’re looking for new or used items. Our categorized inventory makes it easy to find exactly what you need in seconds.',
        lottieAnim: require('@/assets/lottie/onboarding1.json') // Adjust path
    },
    {
        id: '2',
        title: 'Submit Requests Instantly',
        description: 'Submit a request for the parts you need, and we’ll connect you to verified local shops instantly. Once you confirm your request, the right shops will be notified, and you’ll receive quick responses to get your car back on the road faster.',
        lottieAnim: require('@/assets/lottie/onboarding2.json') // Adjust path
    },
    {
        id: '3',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    },
]
export default function OnboardingPage() {
  const colors = useAppColors();

  const handleOnboardingComplete = () => {
    router.replace('/(tabs)');
  };

  return (
    // SafeAreaView or regular View depending on your layout needs
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgColor }]}>
      <Onboarding
        data={AppOnboardingData}
        onComplete={handleOnboardingComplete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});