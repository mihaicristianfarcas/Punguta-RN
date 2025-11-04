import React from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Store } from '../types/Store';
import { useProducts } from '../context/ProductContext';
import { useLists } from '../context/ListContext';
import { useCategories } from '../context/CategoryContext';
import { STORE_TYPE_DEFAULTS } from '../constants/storeTypes';
import { EmptyState } from '../components/shared/EmptyState';
import { CategoryIcon } from '../components/shared/CategoryIcon';
import { formatQuantity } from '../utils/formatters';

interface StoreDetailScreenProps {
  store: Store;
  onBack: () => void;
}

export function StoreDetailScreen({ store, onBack }: StoreDetailScreenProps) {
  const { products } = useProducts();
  const { listItems, lists } = useLists();
  const { getCategoryById } = useCategories();

  // Get all products that belong to categories in this store
  const storeProducts = products.filter(
    (product) => product.categoryId && store.categoryOrder.includes(product.categoryId)
  );

  // Group products by category in store's order
  const sections = store.categoryOrder
    .map((categoryId) => {
      const category = getCategoryById(categoryId);
      const categoryProducts = storeProducts.filter((p) => p.categoryId === categoryId);

      if (!category || categoryProducts.length === 0) {
        return null;
      }

      return {
        categoryId,
        title: category.name,
        data: categoryProducts,
      };
    })
    .filter(Boolean) as {
    categoryId: string;
    title: string;
    data: typeof products;
  }[];

  const totalProducts = storeProducts.length;

  // Calculate how many of these products are checked across all lists
  const checkedProductIds = new Set(
    listItems.filter((item) => item.isChecked).map((item) => item.productId)
  );
  const checkedCount = storeProducts.filter((p) => checkedProductIds.has(p.id)).length;

  const typeConfig = STORE_TYPE_DEFAULTS[store.type];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* Header */}
      <View className="border-b border-gray-200 bg-white px-3 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold">{store.name}</Text>
            <Text className="mt-1 text-sm text-gray-500">{store.type}</Text>
          </View>
        </View>
      </View>

      {/* Store Info Card */}
      <View className="m-3 rounded-xl bg-white p-3 shadow-sm">
        <View className="mb-3 flex-row items-center">
          <View
            className="mr-3 h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: `${typeConfig.color}20` }}>
            <Ionicons name={typeConfig.icon as any} size={24} color={typeConfig.color} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">{store.name}</Text>
            {store.location.address && (
              <Text className="mt-1 text-sm text-gray-500">{store.location.address}</Text>
            )}
          </View>
        </View>

        <View className="mt-2 flex-row gap-3">
          <View className="flex-1 rounded-lg bg-blue-50 p-3">
            <Text className="mb-1 text-xs uppercase text-blue-600">Products</Text>
            <Text className="text-2xl font-bold text-blue-700">{totalProducts}</Text>
          </View>
          <View className="flex-1 rounded-lg bg-green-50 p-3">
            <Text className="mb-1 text-xs uppercase text-green-600">Categories</Text>
            <Text className="text-2xl font-bold text-green-700">{store.categoryOrder.length}</Text>
          </View>
        </View>
      </View>

      {/* Products by Category */}
      {sections.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          title="No Products Yet"
          message="Add products with categories that match this store to see them organized here"
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <View className="flex-row items-center bg-gray-100 px-3 py-2">
              <CategoryIcon categoryId={section.categoryId} size={16} />
              <Text className="ml-2 text-sm font-semibold uppercase text-gray-700">
                {section.title}
              </Text>
              <Text className="ml-auto text-xs text-gray-500">
                {section.data.length} {section.data.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
          )}
          renderItem={({ item: product }) => {
            const isChecked = checkedProductIds.has(product.id);

            return (
              <View className="border-b border-gray-200 bg-white px-3 py-3">
                <View className="flex-row items-center">
                  {isChecked && (
                    <View className="mr-3">
                      <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text
                      className={`text-base font-semibold ${
                        isChecked ? 'text-gray-400' : 'text-gray-800'
                      }`}>
                      {product.name}
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500">
                      {formatQuantity(product.quantity)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Info Banner */}
      <View className="mx-3 mb-3 rounded-lg bg-blue-50 p-3">
        <View className="flex-row items-start">
          <Ionicons name="information-circle" size={16} color="#007AFF" />
          <Text className="ml-2 flex-1 text-xs text-blue-700">
            Products are organized in the order you&apos;ll find them in this store. Products shown
            here match the store&apos;s category layout.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
