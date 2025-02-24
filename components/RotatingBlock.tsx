import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedSensor,
  useAnimatedStyle,
  SensorType,
  withTiming,
} from 'react-native-reanimated';

export default function RotatingBlock() {
  // Using ROTATION sensor to get device orientation
  const rotationSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 'auto', // Matches screen refresh rate
    adjustToInterfaceOrientation: true,
  });

  // Create animated style based on sensor data
  const animatedStyle = useAnimatedStyle(() => {
    const { pitch } = rotationSensor.sensor.value;
    const rotationDegrees = pitch * (180 / Math.PI);
    // Limit rotation to ±90 degrees
    const boundedRotation = Math.min(Math.max(rotationDegrees, -90), 90);
    return {
      transform: [
        { rotateX: `${withTiming(boundedRotation, { duration: 100 })}deg` },
      ],
    };
  });
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.block, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  block: {
    width: 100,
    height: 100,
    backgroundColor: 'purple',
    borderRadius: 8,
  },
});