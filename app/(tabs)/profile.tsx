import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <AuthGuard>
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="px-6 py-8">
            <Text className="text-white text-3xl font-bold mb-2">Profile</Text>
            <Text className="text-gray-400 text-base">
              Manage your account and preferences
            </Text>
          </View>

          {/* User Info Card */}
          <View className="px-6 mb-6">
            <View className="bg-surface-card border border-surface-border rounded-2xl p-6">
              <View className="items-center mb-6">
                {/* Avatar Placeholder */}
                <View className="w-24 h-24 bg-brand-500/20 rounded-full items-center justify-center mb-4">
                  <Text className="text-brand-400 text-4xl font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>

                {/* Email */}
                <Text className="text-white text-lg font-semibold mb-1">
                  {user?.email || 'No email'}
                </Text>
                <Text className="text-gray-400 text-sm">
                  Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
              </View>

              {/* User ID (for debugging) */}
              <View className="pt-4 border-t border-surface-border">
                <Text className="text-gray-500 text-xs mb-1">User ID</Text>
                <Text className="text-gray-400 text-xs font-mono">
                  {user?.id || 'Not available'}
                </Text>
              </View>
            </View>
          </View>

          {/* Account Settings */}
          <View className="px-6 mb-6">
            <Text className="text-white text-lg font-semibold mb-4">Account Settings</Text>

            <View className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
              {/* Email Verification Status */}
              <View className="p-4 border-b border-surface-border">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-white font-medium mb-1">Email Verification</Text>
                    <Text className="text-gray-400 text-sm">
                      {user?.email_confirmed_at ? 'Verified' : 'Not verified'}
                    </Text>
                  </View>
                  {user?.email_confirmed_at ? (
                    <View className="bg-green-500/20 px-3 py-1 rounded-full">
                      <Text className="text-green-400 text-xs font-semibold">Verified</Text>
                    </View>
                  ) : (
                    <View className="bg-yellow-500/20 px-3 py-1 rounded-full">
                      <Text className="text-yellow-400 text-xs font-semibold">Pending</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Change Password */}
              <TouchableOpacity
                className="p-4 border-b border-surface-border"
                onPress={() => router.push('/(auth)/reset-password')}
              >
                <Text className="text-white font-medium mb-1">Change Password</Text>
                <Text className="text-gray-400 text-sm">Update your account password</Text>
              </TouchableOpacity>

              {/* Last Sign In */}
              <View className="p-4">
                <Text className="text-white font-medium mb-1">Last Sign In</Text>
                <Text className="text-gray-400 text-sm">
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : 'Not available'
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* Sign Out Button */}
          <View className="px-6 pb-8">
            <Button
              label="Sign Out"
              onPress={handleSignOut}
              variant="secondary"
            />
          </View>

          {/* App Info */}
          <View className="px-6 pb-8">
            <Text className="text-gray-500 text-xs text-center">
              SM Time v1.0.0
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthGuard>
  );
}
