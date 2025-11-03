import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color = '#34C759', height = 8 }: ProgressBarProps) {
  const percentage = Math.min(Math.max(progress * 100, 0), 100);
  
  return (
    <View
      className="w-full bg-gray-200 rounded-full overflow-hidden"
      style={{ height }}
    >
      <View
        className="h-full rounded-full"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
