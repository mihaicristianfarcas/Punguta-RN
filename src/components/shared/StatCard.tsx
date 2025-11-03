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
    <View className="bg-white rounded-xl p-4 flex-1 shadow-sm">
      <View className="flex-row items-center mb-2">
        <View
          className="w-8 h-8 rounded-full items-center justify-center mr-2"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text className="text-xs text-gray-500 uppercase tracking-wide">{label}</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800">{value}</Text>
    </View>
  );
}
