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
  const storeProducts = products.filter(product =>
    product.categoryId && store.categoryOrder.includes(product.categoryId)
  );

  // Group products by category in store's order
  const sections = store.categoryOrder
    .map(categoryId => {
      const category = getCategoryById(categoryId);
      const categoryProducts = storeProducts.filter(p => p.categoryId === categoryId);
      
      if (!category || categoryProducts.length === 0) {
        return null;
      }

      return {
        categoryId,
        title: category.name,
        data: categoryProducts,
      };
    })
    .filter(Boolean) as Array<{
    categoryId: string;
    title: string;
    data: typeof products;
  }>;

  const totalProducts = storeProducts.length;

  // Calculate how many of these products are checked across all lists
  const checkedProductIds = new Set(
    listItems.filter(item => item.isChecked).map(item => item.productId)
  );
  const checkedCount = storeProducts.filter(p => checkedProductIds.has(p.id)).length;

  const typeConfig = STORE_TYPE_DEFAULTS[store.type];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold">{store.name}</Text>
            <Text className="text-sm text-gray-500 mt-1">{store.type}</Text>
          </View>
        </View>
      </View>

      {/* Store Info Card */}
      <View className="bg-white m-4 p-4 rounded-xl shadow-sm">
        <View className="flex-row items-center mb-3">
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${typeConfig.color}20` }}
          >
            <Ionicons name={typeConfig.icon as any} size={24} color={typeConfig.color} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">{store.name}</Text>
            {store.location.address && (
              <Text className="text-sm text-gray-500 mt-1">{store.location.address}</Text>
            )}
          </View>
        </View>

        <View className="flex-row gap-3 mt-2">
          <View className="flex-1 bg-blue-50 p-3 rounded-lg">
            <Text className="text-xs text-blue-600 uppercase mb-1">Products</Text>
            <Text className="text-2xl font-bold text-blue-700">{totalProducts}</Text>
          </View>
          <View className="flex-1 bg-green-50 p-3 rounded-lg">
            <Text className="text-xs text-green-600 uppercase mb-1">Categories</Text>
            <Text className="text-2xl font-bold text-green-700">
              {store.categoryOrder.length}
            </Text>
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
          keyExtractor={item => item.id}
          renderSectionHeader={({ section }) => (
            <View className="flex-row items-center px-4 py-2 bg-gray-100">
              <CategoryIcon categoryId={section.categoryId} size={16} />
              <Text className="ml-2 text-sm font-semibold text-gray-700 uppercase">
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
              <View className="bg-white border-b border-gray-200 px-4 py-3">
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
                      }`}
                    >
                      {product.name}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
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
      <View className="bg-blue-50 mx-4 mb-4 p-3 rounded-lg">
        <View className="flex-row items-start">
          <Ionicons name="information-circle" size={16} color="#007AFF" />
          <Text className="text-xs text-blue-700 ml-2 flex-1">
            Products are organized in the order you'll find them in this store. Products shown
            here match the store's category layout.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
