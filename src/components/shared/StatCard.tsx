import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color?: string;
}

export function StatCard({ icon, label, value, color = '#007AFF' }: StatCardProps) {
  return (
    <View className="flex-1 rounded-xl bg-white p-4 shadow-sm">
      <View className="mb-2 flex-row items-center">
        <View
          className="mr-2 h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}20` }}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text className="text-xs uppercase tracking-wide text-gray-500">{label}</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800">{value}</Text>
    </View>
  );
}
