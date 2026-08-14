import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import Toast from 'react-native-toast-message';

interface AuthState {
  // State
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  // Actions
  setSession: (session: Session | null) => void;
  setInitializing: (isInitializing: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean }>;
  clearError: () => void;

  // Getters
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  session: null,
  user: null,
  isLoading: false,
  isInitializing: true,
  error: null,

  // Actions
  setSession: (session) => set({
    session,
    user: session?.user ?? null
  }),

  setInitializing: (isInitializing) => set({ isInitializing }),

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        session: data.session,
        user: data.user,
        isLoading: false
      });

      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You have successfully signed in.',
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in';
      set({ error: errorMessage, isLoading: false });

      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: errorMessage,
      });

      return { success: false };
    }
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      set({
        session: data.session,
        user: data.user,
        isLoading: false
      });

      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: 'Please check your email to verify your account.',
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign up';
      set({ error: errorMessage, isLoading: false });

      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: errorMessage,
      });

      return { success: false };
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        session: null,
        user: null,
        isLoading: false
      });

      Toast.show({
        type: 'success',
        text1: 'Signed Out',
        text2: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign out';
      set({ error: errorMessage, isLoading: false });

      Toast.show({
        type: 'error',
        text1: 'Sign Out Failed',
        text2: errorMessage,
      });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'smtime://reset-password',
      });

      if (error) throw error;

      set({ isLoading: false });

      Toast.show({
        type: 'success',
        text1: 'Email Sent',
        text2: 'Check your email for password reset instructions.',
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send reset email';
      set({ error: errorMessage, isLoading: false });

      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: errorMessage,
      });

      return { success: false };
    }
  },

  updatePassword: async (newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      set({ isLoading: false });

      Toast.show({
        type: 'success',
        text1: 'Password Updated',
        text2: 'Your password has been successfully changed.',
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update password';
      set({ error: errorMessage, isLoading: false });

      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
      });

      return { success: false };
    }
  },

  clearError: () => set({ error: null }),

  // Getters
  isAuthenticated: () => get().session !== null,
}));
