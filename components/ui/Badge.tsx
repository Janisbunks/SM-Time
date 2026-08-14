import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning';
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-brand-900',
    success: 'bg-green-900',
    warning: 'bg-yellow-900',
  };
  const textVariants = {
    default: 'text-brand-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
  };

  return (
    <View className={`rounded-full px-2 py-0.5 ${variants[variant]}`}>
      <Text className={`text-xs font-medium ${textVariants[variant]}`}>{label}</Text>
    </View>
  );
}
