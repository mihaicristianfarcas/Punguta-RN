import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterPillProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  isSelected: boolean;
  onPress: () => void;
}

export function FilterPill({ title, icon, color, isSelected, onPress }: FilterPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center rounded-full px-3 py-1.5 ${
        isSelected ? 'bg-blue-500' : 'bg-gray-200'
      }`}
      style={isSelected && color ? { backgroundColor: color } : undefined}>
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={isSelected ? '#fff' : '#666'}
          style={{ marginRight: 4 }}
        />
      )}
      <Text className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
