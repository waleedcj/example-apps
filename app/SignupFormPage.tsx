import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FloatingTextInput from "@/components/ui/FloatingTextInput";
import { useAppColors } from "@/hooks/useAppColors"; 

// Regex and messages
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/; 
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRequirementMessage =
    "Min. 9 chars: 1 uppercase, 1 lowercase, 1 number, 1 special char.";
const REQUIRED_FIELD_MESSAGE = "This field is required.";
const INVALID_EMAIL_MESSAGE = "Please enter a valid email address.";

// Define form fields for easier management and animation staggering
const FORM_FIELDS_CONFIG = [
    { name: "fullName", label: "Full Name", keyboardType: "default" as const },
    { name: "email", label: "Email Address", keyboardType: "email-address" as const },
    { name: "address", label: "Address", keyboardType: "default" as const },
];

type FormData = {
    fullName: string;
    email: string;
    address: string;
    password: string;
};

type FormErrors = {
    fullName?: string;
    email?: string;
    address?: string;
    password?: string;
};

export default function SignupFormPage() {
    const colors = useAppColors();

    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        address: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = () => {
        const errors: FormErrors = {};
        let isValid = true;

        FORM_FIELDS_CONFIG.forEach(fieldConfig => {
            if (!formData[fieldConfig.name as keyof FormData].trim()) {
                errors[fieldConfig.name as keyof FormErrors] = REQUIRED_FIELD_MESSAGE;
                isValid = false;
            }
        });
        
        if (formData.email.trim() && !emailRegex.test(formData.email)) {
            errors.email = INVALID_EMAIL_MESSAGE;
            isValid = false;
        }

        if (!formData.password.trim()) {
            errors.password = REQUIRED_FIELD_MESSAGE;
            isValid = false;
        } else if (!passwordRegex.test(formData.password)) {
            errors.password = passwordRequirementMessage;
            isValid = false;
        }
        
        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log("Form submitted:", { ...formData });
            Alert.alert("Profile Created!", "Your profile has been successfully created.", [
                { text: "OK" } // Example navigation
            ]);
            // Optionally reset form:
            setFormData({ fullName: "", email: "", address: "" , password: ""});
            setFormErrors({});
        } catch (error) {
            console.error("Submission error:", error);
            Alert.alert("Error", "Could not create profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const isSubmitDisabled = useMemo(() => {
        // any field empty or password empty implies invalid to disable button quickly
        if (Object.values(formData).some(value => !value.trim()) ){
             return true;
        }
        // Or if currently submitting
        return isSubmitting;
    }, [formData, isSubmitting]);


    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.Neutral0 }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[styles.headerContainer]}>
                        <Text style={[styles.headerTitle, { color: colors.Neutral900 }]}>
                            Create Your Profile
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: colors.Neutral500 }]}>
                            Please fill in your information to get started
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        {FORM_FIELDS_CONFIG.map((field, index) => (
                            <View
                                key={field.name}
                                style={[
                                    styles.inputWrapper,
                                    
                                ]}
                            >
                                <FloatingTextInput
                                    label={field.label}
                                    value={formData[field.name as keyof FormData]}
                                    valueColor={colors.Neutral700}
                                    onChangeText={(text) =>
                                        handleChange(field.name as keyof FormData, text)
                                    }
                                    backgroundColor={colors.Neutral0}
                                    keyboardType={field.keyboardType}
                                    isError={!!formErrors[field.name as keyof FormErrors]}
                                    isBlurBorderColor={colors.Neutral100}
                                    isBlurValueBorderColor={colors.Neutral300}
                                    errorMessage={formErrors[field.name as keyof FormErrors]}
                                    isFocusBorderColor={colors.PrimaryNormal}
                                    isBlurLabelColor={colors.Neutral500}
                                    reduceMotion="never"
                                    isFocusLabelColor={colors.PrimaryNormal}
                                />
                            </View>
                        ))}

                        <View style={[styles.inputWrapper]}>
                            <FloatingTextInput
                                label="Password"
                                valueColor={colors.Neutral700}
                                value={formData['password']}
                                onChangeText={(text) =>
                                    handleChange('password', text)
                                }
                                backgroundColor={colors.Neutral0}
                                secureTextEntry={!showPassword}
                                clearButtonMode="never"
                                reduceMotion="never"
                                isError={!!formErrors.password}
                                isBlurBorderColor={colors.Neutral100}
                                isBlurValueBorderColor={colors.Neutral300}
                                errorMessage={formErrors.password}
                                isFocusBorderColor={colors.PrimaryNormal}
                                isBlurLabelColor={colors.Neutral500}
                                isFocusLabelColor={colors.PrimaryNormal}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color={colors.Neutral700}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={ { opacity: isSubmitting ? 0.7 : 1 }}>
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    { backgroundColor: colors.PrimaryNormal },
                                    (isSubmitDisabled || isSubmitting) && styles.submitButtonDisabled,
                                ]}
                                onPress={handleSubmit}
                                activeOpacity={0.8} // Handled by animated scale mostly
                                disabled={isSubmitDisabled || isSubmitting}
                            >
                                <Text style={[styles.submitButtonText, { color: colors.Neutral0 }]}>
                                    {isSubmitting ? "Creating Profile..." : "Create Profile"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: Platform.OS === 'ios' ? 100 : 60 }} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 20 : 30, // More padding at the top
        paddingBottom: 20,
    },
    headerContainer: {
        marginBottom: 32,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    headerSubtitle: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
    },
    formContainer: {
        width: "100%",
    },
    inputWrapper: {
        marginBottom: 16,
    },
    eyeIcon: {
        position: "absolute",
        right: 16,
        top: 20 + 50 / 2 - 12, 
        zIndex: 2,
    },
    submitButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 24,
    },
    submitButtonDisabled: {
        backgroundColor: "#D1B999",
        opacity: 0.7, 
    },
    submitButtonText: {
        fontSize: 17,
        fontWeight: "600",
    },
});