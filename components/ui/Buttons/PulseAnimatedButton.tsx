import { ReactElement, useEffect } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
    cancelAnimation,
    Easing,
    interpolate,
    interpolateColor,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useAppColors } from '@/hooks/useAppColors';

export interface PulsingButtonProps {
    accessibilityHint?: string;
    accessibilityLabel?: string;
    Icon?: ReactElement;
    isDisabled?: boolean;
    isLoading?: boolean;
    onPress: () => void;
    title: string;
    reduceMotion?: "never" | "always" | "system";
}

export interface PulseProps {
    index: number;
    isDisabled?: boolean;
    isLoading?: boolean;
}

const BACKGROUND_TRANSITION_DURATION = 300;
const BORDER_RADIUS = 8;
const HEIGHT = 42;
const NUMBER_OF_PULSES = 2;
const PULSE_TRANSITION_DURATION = 2000;
const PULSE_DELAY = 700;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        borderRadius: BORDER_RADIUS,
        flexDirection: "row",
        gap: 8,
        height: HEIGHT,
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    pulse: {
        // backgroundColor: theme.colors.primary,
        borderRadius: BORDER_RADIUS,
        height: HEIGHT,
        position: "absolute",
        width: "100%",
    },
    title: {
        // color: theme.colors.textInverted,
        flexShrink: 1,
        fontSize: 18,
        fontWeight: "600",
    },
});

const Pulse = ({ index, isDisabled, isLoading }: PulseProps) => {
    const transition = useSharedValue(0);
    const  colors  = useAppColors();

    useEffect(() => {
        if (isDisabled || isLoading) {
            cancelAnimation(transition);
            transition.value = 0;
            return;
        }

        transition.value = withRepeat(
            withSequence(
                withDelay(
                    PULSE_DELAY * index,
                    withTiming(1, {
                        duration:
                            PULSE_TRANSITION_DURATION +
                            PULSE_DELAY * (NUMBER_OF_PULSES - index - 1),
                        easing: Easing.out(Easing.ease),
                    })
                ),
                withTiming(0, { duration: 0 })
            ),
            -1
        );

        return () => {
            cancelAnimation(transition);
        };
    }, [index, isDisabled, isLoading, transition]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(transition.value, [0, 1], [0.5, 0]),
        transform: [
            {
                scale: interpolate(transition.value, [0, 1], [1, 1.5]),
            },
        ],
    }));

    return <Animated.View style={[styles.pulse, animatedStyle, {backgroundColor: colors.PrimaryNormal}]} />;
};

export const PulseAnimatedButton = ({
    accessibilityHint,
    accessibilityLabel,
    Icon,
    isDisabled = false,
    isLoading = false,
    onPress,
    title,
    reduceMotion = "system",
}: PulsingButtonProps) => {
    const backgroundTransition = useSharedValue(0);
    const isActive = useSharedValue(false);
    const colors = useAppColors();

    const motion =
    reduceMotion === "never"
        ? ReduceMotion.Never
        : reduceMotion === "always"
            ? ReduceMotion.Always
            : ReduceMotion.System;

    const animatedContainerStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            backgroundTransition.value,
            [0, 1],
            [colors.PrimaryNormal, colors.PrimaryDisable]
        ),
    }));

    return (
        <Pressable
            accessibilityHint={accessibilityHint}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={{
                busy: isLoading,
                disabled: isDisabled || isLoading,
            }}
            disabled={isDisabled || isLoading}
            
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
            {Array.from({ length: NUMBER_OF_PULSES }).map((_, index) => (
                <Pulse
                    key={index}
                    index={index}
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                />
            ))}
            <Animated.View
                style={[
                    styles.container,
                    animatedContainerStyle,
                    { opacity: isDisabled ? 0.5 : 1 },
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator
                        color={colors.Neutral700}
                        size={18}
                    />
                ) : (
                    <>
                        {Icon}
                        <Text numberOfLines={1} style={[styles.title, {color: colors.Neutral700}]}>
                            {title}
                        </Text>
                    </>
                )}
            </Animated.View>
        </Pressable>
    );
};
