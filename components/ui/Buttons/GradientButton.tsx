import { LinearGradient } from "expo-linear-gradient";
import { ReactElement } from "react"; // Removed useState, useEffect
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";

export interface AnimatedGradientBackgroundButtonProps {
    accessibilityHint?: string;
    accessibilityLabel?: string;
    Icon?: ReactElement;
    isDisabled?: boolean;
    isLoading?: boolean;
    onPress: () => void;
    title: string;
}

const HEIGHT = 42;

const styles = StyleSheet.create({
    contentContainer: { 
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        height: HEIGHT,
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        position: "absolute",
        width: "100%",       
        top: 0,          
        left: 0,            
        zIndex: 1,           
    },
    linearGradient: {
        height: HEIGHT,
        width: '100%', // Gradient just needs to fill its container
    },
    // This is the main Pressable container, handles border radius and overflow
    outerContainer: {
        borderRadius: 8,
        overflow: "hidden",
        width: "100%",
        height: HEIGHT, // Set height here directly
        position: 'relative', // Needed for absolute positioning of contentContainer
    },
    title: {
        flexShrink: 1,
        fontSize: 18,
        fontWeight: "600",
    },
});

export const GradientButton = ({
    accessibilityHint,
    accessibilityLabel,
    Icon,
    isDisabled = false,
    isLoading = false,
    onPress,
    title,
    // reduceMotion prop is received but not used internally anymore
}: AnimatedGradientBackgroundButtonProps) => {
    const { colors } = useTheme();

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
        >
            {({ pressed }) => (
                <View
                    // Removed onLayout
                    style={[
                        styles.outerContainer,
                        // Apply opacity for disabled state to the whole container
                        { opacity: isDisabled ? 0.5 : 1 },
                    ]}
                >
                    {/* Static LinearGradient as the background */}
                    <LinearGradient
                        colors={[colors.PrimaryNormal, colors.PrimaryDisable]}
                        end={{ x: 1, y: 1 }}
                        start={{ x: 0, y: 1 }}
                        style={styles.linearGradient} // Use simplified style
                    />
                    {/* Content View positioned absolutely on top */}
                    <View
                        style={[
                            styles.contentContainer,
                            {
                                // Apply press effect by changing background (overlay)
                                backgroundColor: pressed && !isDisabled ? colors.PrimaryDisable : "transparent",
                            },
                        ]}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.Neutral700} size={18} /> // Changed color to contrast potentially lighter gradients
                        ) : (
                            <>
                                {Icon}
                                <Text numberOfLines={1} style={[styles.title, {color: colors.Neutral700}]}>
                                    {title}
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            )}
        </Pressable>
    );
};