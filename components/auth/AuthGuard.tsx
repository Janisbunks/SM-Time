import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;
  return <>{children}</>;
}
