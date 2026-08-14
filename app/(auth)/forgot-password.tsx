import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/authValidation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordScreen() {
  const { resetPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const validateForm = (): boolean => {
    try {
      forgotPasswordSchema.parse({ email });
      setError('');
      return true;
    } catch (err: any) {
      setError(err.errors[0]?.message || 'Invalid email');
      return false;
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    const result = await resetPassword(email);
    if (result.success) {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 justify-center px-6">
          <View className="bg-surface-card border border-surface-border rounded-2xl p-6 mb-6">
            <Text className="text-white text-2xl font-bold mb-4 text-center">
              Check Your Email
            </Text>
            <Text className="text-gray-400 text-center mb-6">
              We've sent password reset instructions to{'\n'}
              <Text className="text-brand-400 font-semibold">{email}</Text>
            </Text>
            <Text className="text-gray-500 text-sm text-center mb-6">
              Please check your inbox and follow the link to reset your password.
            </Text>
          </View>

          <Button
            label="Back to Sign In"
            onPress={() => router.back()}
            variant="secondary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-8">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-white text-3xl font-bold mb-2">Forgot Password?</Text>
              <Text className="text-gray-400 text-base">
                Enter your email and we'll send you instructions to reset your password
              </Text>
            </View>

            {/* Form */}
            <View className="mb-6">
              <Text className="text-white font-medium mb-2">Email</Text>
              <Input
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!isLoading}
              />
              {error && (
                <Text className="text-red-500 text-sm mt-1">{error}</Text>
              )}
            </View>

            {/* Reset Button */}
            <Button
              label={isLoading ? 'Sending...' : 'Send Reset Link'}
              onPress={handleResetPassword}
              disabled={isLoading}
              className="mb-4"
            />
            {isLoading && (
              <ActivityIndicator size="small" color="#3b82f6" className="mt-2" />
            )}

            {/* Back to Sign In */}
            <View className="flex-row items-center justify-center mt-4">
              <Text className="text-gray-400">Remember your password? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <Text className="text-brand-400 font-semibold">Sign In</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
