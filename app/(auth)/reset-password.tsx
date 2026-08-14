import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/utils/authValidation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ResetPasswordScreen() {
  const { updatePassword, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({});

  const validateForm = (): boolean => {
    try {
      resetPasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {};
      error.errors.forEach((err: any) => {
        const field = err.path[0] as keyof ResetPasswordFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    const result = await updatePassword(formData.password);
    if (result.success) {
      // Navigate to sign in after successful password reset
      router.replace('/(auth)/sign-in');
    }
  };

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
              <Text className="text-white text-3xl font-bold mb-2">Reset Password</Text>
              <Text className="text-gray-400 text-base">
                Enter your new password below
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4 mb-6">
              {/* Password Input */}
              <View>
                <Text className="text-white font-medium mb-2">New Password</Text>
                <Input
                  placeholder="Enter new password"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password-new"
                  editable={!isLoading}
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                )}
                <Text className="text-gray-500 text-xs mt-1">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </Text>
              </View>

              {/* Confirm Password Input */}
              <View className="mt-4">
                <Text className="text-white font-medium mb-2">Confirm New Password</Text>
                <Input
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password-new"
                  editable={!isLoading}
                />
                {errors.confirmPassword && (
                  <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>
                )}
              </View>
            </View>

            {/* Reset Button */}
            <Button
              label={isLoading ? 'Updating Password...' : 'Update Password'}
              onPress={handleResetPassword}
              disabled={isLoading}
              className="mb-4"
            />
            {isLoading && (
              <ActivityIndicator size="small" color="#3b82f6" className="mt-2" />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
