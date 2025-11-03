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
      <Text className="text-xl font-semibold text-gray-800 mt-5">{title}</Text>
      <Text className="text-sm text-gray-500 mt-2 text-center">{message}</Text>
    </View>
  );
}
