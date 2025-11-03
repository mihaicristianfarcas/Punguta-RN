import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Ionicons name={icon} size={60} color="#999" />
      <Text className="mt-5 text-xl font-semibold text-gray-800">{title}</Text>
      <Text className="mt-2 text-center text-sm text-gray-500">{message}</Text>
    </View>
  );
}
