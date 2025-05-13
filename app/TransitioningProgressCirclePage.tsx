import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import TransitioningProgressCircle from '@/components/ui/TransitioningProgressCircle';
import { useAppColors } from '@/hooks/useAppColors';
import Feather from '@expo/vector-icons/Feather';

const PROGRESS_STEP = 0.2; // Increment/decrement by 20%
const SIZE = 150;

export default function TransitioningProgressCirclePage() {
  const colors = useAppColors();
  const [progress, setProgress] = useState(0.2); // Initial progress

  const incrementProgress = () => {
    setProgress((prevProgress) => Math.min(1, prevProgress + PROGRESS_STEP));
  };

  const decrementProgress = () => {
    setProgress((prevProgress) => Math.max(0, prevProgress - PROGRESS_STEP));
  };

  const resetProgress = () => {
    setProgress(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>
        {/* <Text style={[styles.title, {color: colors.Neutral900}]}>Transitioning Circle Progress</Text> */}

        <TransitioningProgressCircle
          progress={progress} // Value between 0 and 1
          progressColor={colors.PrimaryNormal}
          trackColor={colors.PrimaryLightBackground} 
          size={150}
          strokeWidth={8}
          animationDuration={1000}
          reduceMotion='never'
          endIcon={<Feather name="check-circle" size={SIZE * 0.8} color={colors.PrimaryNormal} />}
        >
          {/* Optional: Display progress text inside the circle or your own icon */}
          <Text style={[styles.progressText, {color: colors.Neutral900}]}>
            {`${Math.round(progress * 100)}%`}
          </Text>
        </TransitioningProgressCircle>

        <View style={styles.controlsContainer}>
          <Button title="Increase (+10%)" onPress={incrementProgress} disabled={progress >= 1} />
          <View style={styles.spacer} />
          <Button title="Decrease (-10%)" onPress={decrementProgress} disabled={progress <= 0} />
          <View style={styles.spacer} />
          <Button title="Reset" onPress={resetProgress} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  progressText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333', // Adjust color as needed
  },
  controlsContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  spacer: {
    height: 15,
  },
  infoContainer: {
    marginTop: 20,
  }
});