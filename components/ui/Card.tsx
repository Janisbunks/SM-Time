import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={`bg-surface-card rounded-2xl border border-surface-border ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  );
}
