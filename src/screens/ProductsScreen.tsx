import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { EmptyState } from '../components/shared/EmptyState';
import { FilterPill } from '../components/shared/FilterPill';
import { CategoryIcon } from '../components/shared/CategoryIcon';
import { formatQuantity } from '../utils/formatters';
import { AddEditProductForm } from '../components/products/AddEditProductForm';
import { Product } from '../types/Product';

export function ProductsScreen() {
  const { products, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>();

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategoryId || product.categoryId === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const categoryId = product.categoryId || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search products"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200"
        contentContainerStyle={{ padding: 12, gap: 8 }}
      >
        <FilterPill
          title="All"
          isSelected={selectedCategoryId === null}
          onPress={() => setSelectedCategoryId(null)}
        />
        {categories.map(category => (
          <FilterPill
            key={category.id}
            title={category.name}
            icon={category.icon as any}
            color={category.color}
            isSelected={selectedCategoryId === category.id}
            onPress={() =>
              setSelectedCategoryId(
                selectedCategoryId === category.id ? null : category.id
              )
            }
          />
        ))}
      </ScrollView>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={products.length === 0 ? 'cart' : 'search'}
          title={products.length === 0 ? 'No Products Yet' : 'No Results'}
          message={
            products.length === 0
              ? 'Create your first product to get started'
              : 'No products found matching your search'
          }
        />
      ) : (
        <FlatList
          data={Object.entries(groupedProducts)}
          keyExtractor={([categoryId]) => categoryId}
          renderItem={({ item: [categoryId, categoryProducts] }) => (
            <View className="mb-4">
              {/* Category Header */}
              <View className="flex-row items-center px-4 py-2 bg-gray-100">
                <CategoryIcon categoryId={categoryId} size={16} />
                <Text className="ml-2 text-sm font-semibold text-gray-700 uppercase">
                  {categories.find(c => c.id === categoryId)?.name || 'Uncategorized'}
                </Text>
              </View>

              {/* Products in Category */}
              {categoryProducts.map(product => (
                <View
                  key={product.id}
                  className="bg-white border-b border-gray-200 px-4 py-3"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-800">
                        {product.name}
                      </Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        {formatQuantity(product.quantity)}
                      </Text>
                    </View>
                    <View className="flex-row">
                      <TouchableOpacity
                        onPress={() => {
                          setProductToEdit(product);
                          setShowAddForm(true);
                        }}
                        className="ml-3 p-2"
                      >
                        <Ionicons name="pencil-outline" size={20} color="#007AFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Delete Product',
                            `Are you sure you want to delete "${product.name}"?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => deleteProduct(product.id),
                              },
                            ]
                          );
                        }}
                        className="ml-3 p-2"
                      >
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        />
      )}

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
        onPress={() => {
          setProductToEdit(undefined);
          setShowAddForm(true);
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Form Modal */}
      <AddEditProductForm
        visible={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setProductToEdit(undefined);
        }}
        productToEdit={productToEdit}
      />
    </SafeAreaView>
  );
}
