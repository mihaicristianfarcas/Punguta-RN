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
    <View className="m-4 rounded-xl bg-white p-5 shadow-sm">
      <View className="mb-3 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-bold text-gray-800">
            {completedItems}/{totalItems}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            {totalItems === 0 ? 'No items' : `${Math.round(progressPercentage * 100)}% complete`}
          </Text>
        </View>
        {totalItems > 0 && completedItems === totalItems && (
          <View className="rounded-full bg-green-100 px-3 py-1">
            <Text className="text-sm font-semibold text-green-700">✓ Done</Text>
          </View>
        )}
      </View>

      <ProgressBar progress={progressPercentage} />

      {subtitle && <Text className="mt-3 text-xs text-gray-400">{subtitle}</Text>}
    </View>
  );
}
