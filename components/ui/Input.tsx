import { TextInput, type TextInputProps } from 'react-native';

export default function Input({ className, ...props }: TextInputProps) {
  return (
    <TextInput
      className={`bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 ${className ?? ''}`}
      placeholderTextColor="#6b7280"
      {...props}
    />
  );
}
