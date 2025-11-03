import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { suggestCategory } from '../../utils/categoryHelper';
import { Product } from '../../types/Product';

interface AddEditProductFormProps {
  visible: boolean;
  onClose: () => void;
  productToEdit?: Product;
}

export function AddEditProductForm({ visible, onClose, productToEdit }: AddEditProductFormProps) {
  const { addProduct, updateProduct } = useProducts();
  const { categories, getCategoryById } = useCategories();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('kg');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [suggestedCategoryId, setSuggestedCategoryId] = useState<string | undefined>();

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setAmount(productToEdit.quantity.amount.toString());
      setUnit(productToEdit.quantity.unit);
      setSelectedCategoryId(productToEdit.categoryId);
    } else {
      setName('');
      setAmount('');
      setUnit('kg');
      setSelectedCategoryId(undefined);
      setSuggestedCategoryId(undefined);
    }
  }, [productToEdit, visible]);

  // Auto-suggest category based on product name
  useEffect(() => {
    if (name && !productToEdit) {
      const suggestion = suggestCategory(name);
      if (suggestion) {
        setSuggestedCategoryId(suggestion.suggestedCategoryId);
        if (!selectedCategoryId) {
          setSelectedCategoryId(suggestion.suggestedCategoryId);
          setUnit(suggestion.suggestedUnit);
        }
      }
    }
  }, [name]);

  const handleSave = () => {
    if (!name.trim() || !amount.trim()) {
      return;
    }

    const quantity = {
      amount: parseFloat(amount),
      unit,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name: name.trim(),
        quantity,
        categoryId: selectedCategoryId,
      });
    } else {
      addProduct(name.trim(), quantity, selectedCategoryId);
    }

    onClose();
  };

  const handleClose = () => {
    setName('');
    setAmount('');
    setUnit('kg');
    setSelectedCategoryId(undefined);
    setSuggestedCategoryId(undefined);
    onClose();
  };

  const commonUnits = ['kg', 'g', 'L', 'ml', 'pcs', 'units'];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="border-b border-gray-200 bg-white px-4 py-3">
            <View className="mt-2 flex-row items-center justify-between">
              <TouchableOpacity onPress={handleClose} className="py-2">
                <Text className="text-base text-blue-500">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold">
                {productToEdit ? 'Edit Product' : 'New Product'}
              </Text>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!name.trim() || !amount.trim()}
                className="py-2">
                <Text
                  className={`text-base font-semibold ${
                    name.trim() && amount.trim() ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1">
            {/* Product Name */}
            <View className="mt-6 bg-white px-4 py-3">
              <Text className="mb-2 text-xs uppercase text-gray-500">Product Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Milk, Apples, Bread"
                className="text-base text-gray-800"
                autoFocus={!productToEdit}
              />
            </View>

            {/* Quantity */}
            <View className="mt-6 bg-white px-4 py-3">
              <Text className="mb-2 text-xs uppercase text-gray-500">Quantity</Text>
              <View className="flex-row items-center">
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Amount"
                  keyboardType="decimal-pad"
                  className="flex-1 text-base text-gray-800"
                />
                <View className="ml-3 w-24">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row">
                    {commonUnits.map((u) => (
                      <TouchableOpacity
                        key={u}
                        onPress={() => setUnit(u)}
                        className={`mr-2 rounded-lg px-3 py-2 ${
                          unit === u ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                        <Text
                          className={`text-sm font-medium ${
                            unit === u ? 'text-white' : 'text-gray-700'
                          }`}>
                          {u}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>

            {/* Category */}
            <View className="mt-6 bg-white px-4 py-3">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-xs uppercase text-gray-500">Category</Text>
                {suggestedCategoryId && !productToEdit && (
                  <View className="flex-row items-center">
                    <Ionicons name="bulb-outline" size={14} color="#FF9500" />
                    <Text className="ml-1 text-xs text-orange-500">Suggested</Text>
                  </View>
                )}
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {categories.map((category) => {
                    const isSelected = selectedCategoryId === category.id;
                    const isSuggested = suggestedCategoryId === category.id;

                    return (
                      <TouchableOpacity
                        key={category.id}
                        onPress={() => setSelectedCategoryId(category.id)}
                        className={`flex-row items-center rounded-lg border px-3 py-2 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : isSuggested
                              ? 'border-orange-300 bg-orange-50'
                              : 'border-gray-200 bg-white'
                        }`}>
                        <View
                          className="mr-2 h-6 w-6 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${category.color}40` }}>
                          <Ionicons name={category.icon as any} size={14} color={category.color} />
                        </View>
                        <Text
                          className={`text-sm ${
                            isSelected ? 'font-semibold text-blue-700' : 'text-gray-700'
                          }`}>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Selected Category Info */}
            {selectedCategoryId && (
              <View className="mx-4 mt-4 rounded-lg bg-blue-50 p-3">
                <View className="flex-row items-center">
                  <Ionicons name="information-circle" size={16} color="#007AFF" />
                  <Text className="ml-2 text-xs text-blue-700">
                    {getCategoryById(selectedCategoryId)?.name} products are typically measured in{' '}
                    {getCategoryById(selectedCategoryId)?.defaultUnit}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
