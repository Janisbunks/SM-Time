import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { signInSchema, type SignInFormData } from '@/utils/authValidation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SignInScreen() {
  const { signIn, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignInFormData, string>>>({});

  const validateForm = (): boolean => {
    try {
      signInSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<Record<keyof SignInFormData, string>> = {};
      error.errors.forEach((err: any) => {
        const field = err.path[0] as keyof SignInFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    const result = await signIn(formData.email, formData.password);
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
              <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
              <Text className="text-gray-400 text-base">
                Sign in to continue tracking your favorite content
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!isLoading}
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                )}
              </View>

              {/* Forgot Password Link */}
              <View className="items-end mt-2">
                <Link href="/(auth)/forgot-password" asChild>
                  <TouchableOpacity>
                    <Text className="text-brand-400 font-medium">Forgot Password?</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Sign In Button */}
            <Button
              label={isLoading ? 'Signing In...' : 'Sign In'}
              onPress={handleSignIn}
              disabled={isLoading}
              className="mb-4"
            />
            {isLoading && (
              <ActivityIndicator size="small" color="#3b82f6" className="mt-2" />
            )}

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center mt-4">
              <Text className="text-gray-400">Don't have an account? </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Text className="text-brand-400 font-semibold">Sign Up</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
