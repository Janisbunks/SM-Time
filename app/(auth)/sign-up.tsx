import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { signUpSchema, type SignUpFormData } from '@/utils/authValidation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SignUpScreen() {
  const { signUp, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});

  const validateForm = (): boolean => {
    try {
      signUpSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      error.errors.forEach((err: any) => {
        const field = err.path[0] as keyof SignUpFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const result = await signUp(formData.email, formData.password);
    if (result.success) {
      router.replace('/(tabs)');
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
              <Text className="text-white text-3xl font-bold mb-2">Create Account</Text>
              <Text className="text-gray-400 text-base">
                Sign up to start tracking your favorite shows and movies
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4 mb-6">
              {/* Email Input */}
              <View>
                <Text className="text-white font-medium mb-2">Email</Text>
                <Input
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  editable={!isLoading}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
                )}
              </View>

              {/* Password Input */}
              <View className="mt-4">
                <Text className="text-white font-medium mb-2">Password</Text>
                <Input
                  placeholder="Create a password"
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
                <Text className="text-white font-medium mb-2">Confirm Password</Text>
                <Input
                  placeholder="Confirm your password"
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

            {/* Sign Up Button */}
            <Button
              label={isLoading ? 'Creating Account...' : 'Sign Up'}
              onPress={handleSignUp}
              disabled={isLoading}
              className="mb-4"
            />
            {isLoading && (
              <ActivityIndicator size="small" color="#3b82f6" className="mt-2" />
            )}

            {/* Sign In Link */}
            <View className="flex-row items-center justify-center mt-4">
              <Text className="text-gray-400">Already have an account? </Text>
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
