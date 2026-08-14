import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const {
    session,
    user,
    isLoading,
    isInitializing,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    clearError,
    isAuthenticated,
  } = useAuthStore();

  return {
    // State
    session,
    user,
    isLoading,
    isInitializing,
    error,

    // Methods
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    clearError,

    // Computed
    isAuthenticated: isAuthenticated(),
  };
}
