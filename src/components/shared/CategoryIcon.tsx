import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '../../context/CategoryContext';

interface CategoryIconProps {
  categoryId: string;
  size?: number;
}

export function CategoryIcon({ categoryId, size = 20 }: CategoryIconProps) {
  const { getCategoryById } = useCategories();
  const category = getCategoryById(categoryId);
  
  if (!category) {
    return (
      <View
        className="rounded-full items-center justify-center"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          backgroundColor: '#E0E0E0',
        }}
      >
        <Ionicons name="pricetag" size={size} color="#999" />
      </View>
    );
  }
  
  return (
    <View
      className="rounded-full items-center justify-center"
      style={{
        width: size * 1.8,
        height: size * 1.8,
        backgroundColor: `${category.color}40`,
      }}
    >
      <Ionicons name={category.icon as any} size={size} color={category.color} />
    </View>
  );
}
