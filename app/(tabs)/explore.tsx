import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons
import FloatingTextInput from '@/components/ui/FloatingTextInput';
import SmoothBorderTextInput from '@/components/ui/textInput/SmoothBorderTextInput';


export default function TabTwoScreen() {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Update form data
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    setSubmitted(true);
    console.log('Form submitted:', formData);
    // Add validation logic here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={[styles.headerTitle, {color: colors.Neutral700}]}>Create Your Profile</Text>
            <Text style={[styles.headerSubtitle,  {color: colors.Neutral500}]}>
              Please fill in your information to get started
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <View style={styles.inputWrapper}>
              <FloatingTextInput
                label="Full Name"
                value={formData.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                backgroundColor={colors.background}
                containerStyle={styles.inputContainer}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <FloatingTextInput
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
				backgroundColor={colors.background}
                keyboardType="email-address"
                containerStyle={styles.inputContainer}
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputWrapper}>
              <FloatingTextInput
                label="Phone Number"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
				backgroundColor={colors.background}
                keyboardType="phone-pad"
                containerStyle={styles.inputContainer}
              />
            </View>

            {/* Address Input */}
            <View style={styles.inputWrapper}>
              <FloatingTextInput
                label="Address"
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
				backgroundColor={colors.background}
                containerStyle={styles.inputContainer}
              />
            </View>

			{/* <View style={styles.inputWrapper}>
              <SmoothBorderTextInput
                label="Address"
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
				backgroundColor={colors.background}
                containerStyle={styles.inputContainer}
              />
            </View> */}


            {/* Password Input with Show/Hide */}
            <View style={styles.inputWrapper}>
              <View style={styles.passwordContainer}>
                <FloatingTextInput
                  label="Password"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
				  backgroundColor={colors.background}
                  secureTextEntry={!showPassword}
                  containerStyle={styles.inputContainer}
                  clearButtonMode="never"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Create Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  headerContainer: {
    marginBottom: 32,
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 10,
    height: 70,
  },
  inputContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 32,
    zIndex: 2,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#4F46E5', // Indigo color
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});