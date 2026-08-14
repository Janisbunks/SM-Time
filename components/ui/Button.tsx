import { TouchableOpacity, Text, type TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function Button({ label, variant = 'primary', className, ...props }: ButtonProps) {
  const base = 'rounded-xl px-5 py-3 items-center justify-center';
  const variants = {
    primary:   'bg-brand-500',
    secondary: 'bg-surface-card border border-surface-border',
    ghost:     'bg-transparent',
  };

  return (
    <TouchableOpacity className={`${base} ${variants[variant]} ${className ?? ''}`} {...props}>
      <Text className={variant === 'primary' ? 'text-white font-semibold' : 'text-brand-400 font-semibold'}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
