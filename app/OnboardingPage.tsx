import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Onboarding from '@/components/ui/Onboarding';
import { useAppColors } from '@/hooks/useAppColors';

// Define or import your onboarding data
const AppOnboardingData = [
  {
      id: '1',
      title: 'Discover Local Services, Fast',
      description: 'Browse through a wide range of local services tailored to your needs. Filter by category, location, and service type, whether you need home maintenance, repairs, or professional services. Our organized directory makes it simple to find the right provider in your area.',
      lottieAnim: require('@/assets/lottie/onboarding1.json') // Adjust path
  },
  {
      id: '2',
      title: 'Book Appointments Instantly',
      description: 'Submit a booking request for the service you need, and we will connect you to verified local providers instantly. Once you confirm your requirements, qualified professionals will be notified, and you will receive quick responses to schedule your appointment.',
      lottieAnim: require('@/assets/lottie/onboarding2.json') // Adjust path
  },
  {
      id: '3',
      title: 'Chat with Providers, Directly',
      description: 'Once your booking is accepted, you can chat directly with the service provider via WhatsApp for easy coordination. No extra steps—just simple, direct communication to confirm your appointment details!',
      lottieAnim: require('@/assets/lottie/onboarding3.json') // Adjust path
  },
]
export default function OnboardingPage() {
  const colors = useAppColors();

  const handleOnboardingComplete = () => {
    alert("Onboarding is complete now shh shh");
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