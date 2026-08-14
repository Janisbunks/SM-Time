import { ScrollView, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps extends ScrollViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export default function ScreenWrapper({ children, scrollable = true, ...props }: ScreenWrapperProps) {
  if (!scrollable) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        {children}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
