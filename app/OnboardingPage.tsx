// Example Usage in a screen (e.g., screens/OnboardingScreen.tsx)

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Onboarding from '@/components/ui/Onboarding';
// Import your actual hook and data
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
    {
        id: '4',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '5',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '6',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '7',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '8',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '9',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '10',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '11',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '12',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '13',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '14',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '15',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '16',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '17',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, {
        id: '18',
        title: 'Chat with Sellers, Directly',
        description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
        lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    }, 
    //{
    //     id: '19',
    //     title: 'Chat with Sellers, Directly',
    //     description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
    //     lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    // }, {
    //     id: '20',
    //     title: 'Chat with Sellers, Directly',
    //     description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
    //     lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    // }, {
    //     id: '21',
    //     title: 'Chat with Sellers, Directly',
    //     description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
    //     lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    // }, {
    //     id: '22',
    //     title: 'Chat with Sellers, Directly',
    //     description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
    //     lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    // }, {
    //     id: '23',
    //     title: 'Chat with Sellers, Directly',
    //     description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
    //     lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    // }, {
    //     id: '24',
    //     title: 'Chat with Sellers, Directly',
    //     description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
    //     lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    // }, {
    //     id: '25',
    //     title: 'Chat with Sellers, Directly',
    //     description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
    //     lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    // }, {
    //     id: '26',
    //     title: 'Chat with Sellers, Directly',
    //     description: 'Once your request is accepted, you can chat directly with the seller via WhatsApp for easy order confirmation. No extra steps—just simple, direct communication to finalize your purchase!',
    //     lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
    // },
]

const OnboardingPage = () => {
  const colors = useAppColors(); // Use colors for screen background if needed

  const handleOnboardingComplete = () => {
    // --- Application Specific Logic ---
    // 1. Save onboarding status (e.g., using AsyncStorage or your state management)
    // Example: YourStore.setHasSeenOnboarding(true);
    console.log('Onboarding completed!');

    // 2. Navigate away using Expo Router
    router.replace('/(tabs)'); // Replace with your target route (e.g., home or main tabs)
     // --- End Application Specific Logic ---
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

export default OnboardingPage;