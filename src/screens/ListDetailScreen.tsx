import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SectionList,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { useLists } from '../context/ListContext';
import { useCategories } from '../context/CategoryContext';
import { ShoppingList } from '../types/ShoppingList';
import { Product } from '../types/Product';
import { ProgressHeaderCard } from '../components/shared/ProgressHeaderCard';
import { EmptyState } from '../components/shared/EmptyState';
import { CategoryIcon } from '../components/shared/CategoryIcon';
import { formatQuantity, formatRelativeTime } from '../utils/formatters';
import { AddEditProductForm } from '../components/products/AddEditProductForm';

interface ListDetailScreenProps {
  list: ShoppingList;
  onBack: () => void;
}

export function ListDetailScreen({ list, onBack }: ListDetailScreenProps) {
  const { products } = useProducts();
  const { listItems, addProductToList, removeProductFromList, toggleProductChecked } = useLists();
  const { categories } = useCategories();
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showInlineAddForm, setShowInlineAddForm] = useState(false);
  const [pendingProductName, setPendingProductName] = useState<string | undefined>();

  // Get products in this list
  const listProductIds = listItems
    .filter((item) => item.shoppingListId === list.id)
    .map((item) => item.productId);

  const listProducts = products.filter((p) => listProductIds.includes(p.id));

  // Calculate stats
  const totalItems = listProducts.length;
  const completedItems = listItems.filter(
    (item) => item.shoppingListId === list.id && item.isChecked
  ).length;
  const progressPercentage = totalItems > 0 ? completedItems / totalItems : 0;

  // Group products by category
  const groupedProducts = listProducts.reduce(
    (acc, product) => {
      const categoryId = product.categoryId || 'uncategorized';
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(product);
      return acc;
    },
    {} as Record<string, Product[]>
  );

  // Convert to section list format
  const sections = Object.entries(groupedProducts).map(([categoryId, categoryProducts]) => ({
    categoryId,
    title: categories.find((c) => c.id === categoryId)?.name || 'Uncategorized',
    data: categoryProducts,
  }));

  // Products not in list
  const availableProducts = products.filter((p) => !listProductIds.includes(p.id));
  const filteredAvailableProducts = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const normalizedSearch = searchText.trim();

  const handleToggle = (productId: string) => {
    toggleProductChecked(list.id, productId);
  };

  const handleRemove = (product: Product) => {
    Alert.alert('Remove Item', `Remove "${product.name}" from this list?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeProductFromList(list.id, product.id),
      },
    ]);
  };

  const handleAddProduct = (productId: string) => {
    addProductToList(list.id, productId);
    setShowProductPicker(false);
    setSearchText('');
  };

  const handleShowCreateProduct = () => {
    setPendingProductName(normalizedSearch || undefined);
    setShowProductPicker(false);
    setShowInlineAddForm(true);
  };

  const handleProductCreatedFromList = (product: Product) => {
    setShowInlineAddForm(false);
    setPendingProductName(undefined);
    setSearchText(product.name);
  };

  const isChecked = (productId: string) => {
    return listItems.some(
      (item) => item.shoppingListId === list.id && item.productId === productId && item.isChecked
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* Header */}
      <View className="border-b border-gray-200 bg-white px-3 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text className="flex-1 text-xl font-bold">{list.name}</Text>
        </View>
      </View>

      {/* Progress Header */}
      <ProgressHeaderCard
        totalItems={totalItems}
        completedItems={completedItems}
        progressPercentage={progressPercentage}
        subtitle={`Updated ${formatRelativeTime(list.updatedAt)}`}
      />

      {/* Products List */}
      {listProducts.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          title="No Products Yet"
          message="Add products to your list to get started"
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
            </View>
          )}
          renderItem={({ item: product }) => {
            const checked = isChecked(product.id);
            return (
              <View className="border-b border-gray-200 bg-white px-3 py-3">
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => handleToggle(product.id)} className="mr-3">
                    <Ionicons
                      name={checked ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={checked ? '#34C759' : '#CCC'}
                    />
                  </TouchableOpacity>

                  <View className="flex-1">
                    <Text
                      className={`text-base font-semibold ${
                        checked ? 'text-gray-400 line-through' : 'text-gray-800'
                      }`}>
                      {product.name}
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500">
                      {formatQuantity(product.quantity)}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => handleRemove(product)} className="ml-3 p-2">
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Add Product Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
        activeOpacity={0.8}
        onPress={() => setShowProductPicker(true)}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Product Picker Modal */}
      <Modal visible={showProductPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="border-b border-gray-200 bg-white px-3 py-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold">Add Products</Text>
              <TouchableOpacity onPress={() => setShowProductPicker(false)} className="py-2">
                <Text className="text-base text-blue-500">Done</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search */}
          <View className="border-b border-gray-200 bg-white px-3 py-3">
            <View className="flex-row items-center rounded-lg bg-gray-100 px-3 py-2">
              <Ionicons name="search" size={20} color="#999" />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search products"
                className="ml-2 flex-1 text-base"
              />
            </View>
          </View>

          {/* Available Products */}
          <View className="flex-1">
            {filteredAvailableProducts.length === 0 ? (
              <EmptyState
                icon="cart-outline"
                title="No Products Available"
                message="All products are already in this list or create new products first"
              />
            ) : (
              <FlatList
                data={filteredAvailableProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item: product }) => (
                  <TouchableOpacity
                    onPress={() => handleAddProduct(product.id)}
                    className="border-b border-gray-200 bg-white px-3 py-3">
                    <View className="flex-row items-center">
                      {product.categoryId && (
                        <CategoryIcon categoryId={product.categoryId} size={20} />
                      )}
                      <View className="ml-3 flex-1">
                        <Text className="text-base font-semibold text-gray-800">{product.name}</Text>
                        <Text className="mt-1 text-sm text-gray-500">
                          {formatQuantity(product.quantity)}
                        </Text>
                      </View>
                      <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            <View className="mx-3 mb-6 mt-4">
              <TouchableOpacity
                onPress={handleShowCreateProduct}
                className="flex-row items-center justify-center rounded-2xl bg-blue-500 px-4 py-4"
                activeOpacity={0.85}>
                <Ionicons name="create-outline" size={20} color="white" />
                <Text className="ml-2 text-base font-semibold text-white">Create new product</Text>
              </TouchableOpacity>
              <Text className="mt-2 text-center text-xs text-gray-500">
                {normalizedSearch
                  ? `We'll prefill the name with "${normalizedSearch}"`
                  : 'Opens the product creator so you can add anything missing'}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <AddEditProductForm
        visible={showInlineAddForm}
        onClose={() => {
          setShowInlineAddForm(false);
          setPendingProductName(undefined);
          setShowProductPicker(true);
        }}
        initialName={pendingProductName}
        onProductCreated={handleProductCreatedFromList}
      />
    </SafeAreaView>
  );
}
