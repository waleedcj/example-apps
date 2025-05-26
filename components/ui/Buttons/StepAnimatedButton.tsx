import { ReactElement, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    cancelAnimation,
    interpolate,
    interpolateColor,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export type AnimatedScrollingButtonProps = {
    accessibilityHint?: string;
    accessibilityLabel?: string;
    currentStep: number;
    isDisabled?: boolean;
    isLoading?: boolean;
    onPress: () => void;
    buttonColor: string;
    buttonTouchColor: string;
    textColor: string;
    steps: {
        Icon?: ReactElement;
        title: string;
    }[];
    reduceMotion?: "never" | "always" | "system";
}

const BACKGROUND_TRANSITION_DURATION = 300;
const HEIGHT = 42;
const SCROLL_TRANSITION_DURATION = 300;

export const StepAnimatedButton = ({
    accessibilityHint,
    accessibilityLabel,
    currentStep,
    isDisabled = false,
    isLoading = false,
    onPress,
    buttonColor,
    buttonTouchColor,
    textColor,
    steps,
    reduceMotion = "system",
}: AnimatedScrollingButtonProps) => {
    const scrollTransition = useSharedValue(0);
    const backgroundTransition = useSharedValue(0);
    const isActive = useSharedValue(false);

    const motion =
    reduceMotion === "never"
        ? ReduceMotion.Never
        : reduceMotion === "always"
            ? ReduceMotion.Always
            : ReduceMotion.System;

    useEffect(() => {
        scrollTransition.value = withTiming(currentStep, {
            duration: SCROLL_TRANSITION_DURATION,
            reduceMotion: motion
        });

        return () => {
            cancelAnimation(scrollTransition);
        };
    }, [currentStep]);



    const animatedScrollingContainerStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            backgroundTransition.value,
            [0, 1],
            [buttonColor, buttonTouchColor]
        ),
        transform: [
            {
                translateY: interpolate(
                    scrollTransition.value,
                    [0, steps.length - 1],
                    [-HEIGHT * (steps.length - 1), 0]
                ),
            },
        ],
    }));

    return (
        <Pressable
            accessibilityHint={accessibilityHint}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={{
                busy: isLoading || currentStep > 0,
                disabled: isDisabled || isLoading,
            }}
            disabled={isDisabled || isLoading || currentStep > 0}
            
            onPress={onPress}
            onPressIn={() => {
                isActive.value = true;
                backgroundTransition.value = withTiming(
                    1,
                    { duration: BACKGROUND_TRANSITION_DURATION },
                    () => {
                        if (!isActive.value) {
                            backgroundTransition.value = withTiming(0, {
                                duration: BACKGROUND_TRANSITION_DURATION,
                                reduceMotion: motion
                            });
                        }
                    }
                );
            }}
            onPressOut={() => {
                if (backgroundTransition.value === 1) {
                    backgroundTransition.value = withTiming(0, {
                        duration: BACKGROUND_TRANSITION_DURATION,
                        reduceMotion: motion
                    });
                }
                isActive.value = false;
            }}
        >
            <View
                style={[
                    styles.container,
                    {
                        opacity: isDisabled ? 0.5 : 1,
                        backgroundColor: buttonColor
                    },
                ]}
            >
                <Animated.View style={animatedScrollingContainerStyle}>
                    {steps.reverse().map((step) => (
                        <View key={step.title} style={styles.stepContainer}>
                            {step.Icon}
                            <Text numberOfLines={1} style={[styles.title, { color: textColor }]}>
                                {step.title}
                            </Text>
                        </View>
                    ))}
                </Animated.View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        height: HEIGHT,
        overflow: "hidden",
    },
    stepContainer: {
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        height: HEIGHT,
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    title: {
        flexShrink: 1,
        fontSize: 18,
        fontWeight: "600",
    },
});
