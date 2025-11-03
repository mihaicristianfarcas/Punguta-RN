import React from 'react';
import { View, Text } from 'react-native';
import { ProgressBar } from './ProgressBar';

interface ProgressHeaderCardProps {
  totalItems: number;
  completedItems: number;
  progressPercentage: number;
  subtitle?: string;
}

export function ProgressHeaderCard({
  totalItems,
  completedItems,
  progressPercentage,
  subtitle,
}: ProgressHeaderCardProps) {
  return (
    <View className="bg-white rounded-xl p-5 m-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-3xl font-bold text-gray-800">
            {completedItems}/{totalItems}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {totalItems === 0 ? 'No items' : `${Math.round(progressPercentage * 100)}% complete`}
          </Text>
        </View>
        {totalItems > 0 && completedItems === totalItems && (
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-semibold text-sm">✓ Done</Text>
          </View>
        )}
      </View>
      
      <ProgressBar progress={progressPercentage} />
      
      {subtitle && (
        <Text className="text-xs text-gray-400 mt-3">{subtitle}</Text>
      )}
    </View>
  );
}
