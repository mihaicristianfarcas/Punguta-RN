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
  initialName?: string;
  onProductCreated?: (product: Product) => void;
}

export function AddEditProductForm({
  visible,
  onClose,
  productToEdit,
  initialName,
  onProductCreated,
}: AddEditProductFormProps) {
  const { addProduct, updateProduct } = useProducts();
  const { categories } = useCategories();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('kg');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [suggestedCategoryId, setSuggestedCategoryId] = useState<string | undefined>();

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (productToEdit) {
      setName(productToEdit.name);
      setAmount(productToEdit.quantity.amount.toString());
      setUnit(productToEdit.quantity.unit);
      setSelectedCategoryId(productToEdit.categoryId);
    } else {
      setName(initialName || '');
      setAmount('');
      setUnit('kg');
      setSelectedCategoryId(undefined);
      setSuggestedCategoryId(undefined);
    }
  }, [productToEdit, visible, initialName]);

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
  }, [name, productToEdit, selectedCategoryId]);

  const sanitizeAmountInput = (text: string) => {
    const dotted = text.replace(/,/g, '.');
    const allowed = dotted.replace(/[^0-9.]/g, '');
    const parts = allowed.split('.');
    const normalized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : allowed;
    setAmount(normalized);
  };

  const parseAmount = (input: string): number | null => {
    if (!input) return null;
    const n = Number(input);
    return Number.isFinite(n) ? n : null;
  };

  const amountNumber = parseAmount(amount);
  const isFormValid = name.trim().length > 0 && amountNumber !== null && amountNumber > 0;

  const handleSave = () => {
    if (!isFormValid) {
      return;
    }

    const quantity = {
      amount: amountNumber!,
      unit,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name: name.trim(),
        quantity,
        categoryId: selectedCategoryId,
      });
    } else {
      const createdProduct = addProduct(name.trim(), quantity, selectedCategoryId);
      onProductCreated?.(createdProduct);
    }

    // Reset form state
    setName('');
    setAmount('');
    setUnit('kg');
    setSelectedCategoryId(undefined);
    setSuggestedCategoryId(undefined);
    
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        className="flex-1">
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="border-b border-gray-200 bg-white px-4 pb-3 pt-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={handleClose} className="py-2">
                <Text className="text-[17px] text-blue-500">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-[17px] font-semibold">
                {productToEdit ? 'Edit Product' : 'New Product'}
              </Text>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!isFormValid}
                className="py-2">
                <Text
                  className={`text-[17px] font-semibold ${
                    isFormValid ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                  {productToEdit ? 'Save' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
            {/* Product Name */}
            <View className="mt-8 bg-white px-4 py-3">
              <Text className="mb-2 text-[13px] font-normal uppercase tracking-wide text-gray-500">
                Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Product Name"
                placeholderTextColor="#999999"
                className="text-[17px] text-gray-900"
                autoFocus={!productToEdit}
                autoCorrect={false}
              />
            </View>

            {/* Quantity */}
            <View className="mt-8 bg-white px-4 py-3">
              <Text className="mb-2 text-[13px] font-normal uppercase tracking-wide text-gray-500">
                Quantity
              </Text>
              <View className="rounded-xl border border-gray-200 px-3 py-2">
                <View className="flex-row items-center">
                  <TextInput
                    value={amount}
                    onChangeText={sanitizeAmountInput}
                    placeholder="Amount"
                    placeholderTextColor="#999999"
                    keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                    className="flex-1 text-[17px] text-gray-900"
                  />
                  <View className="mx-3 h-6 w-px bg-gray-200" />
                  <View className="rounded-full bg-gray-100 px-3 py-1.5">
                    <Text className="text-[13px] font-semibold uppercase text-gray-600">{unit}</Text>
                  </View>
                </View>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-3"
                contentContainerStyle={{ gap: 8 }}>
                {commonUnits.map((u) => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => setUnit(u)}
                    className={`min-w-[60px] items-center rounded-lg px-3 py-2 ${
                      unit === u ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                    <Text
                      className={`text-[15px] font-medium ${
                        unit === u ? 'text-white' : 'text-gray-700'
                      }`}>
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Category */}
            <View className="mt-8 bg-white px-4 py-3">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-[13px] font-normal uppercase tracking-wide text-gray-500">
                  Category
                </Text>
                {suggestedCategoryId && !productToEdit && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="bulb-outline" size={14} color="#FF9500" />
                    <Text className="text-[12px] font-medium text-orange-500">Suggested</Text>
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
                        className={`flex-row items-center gap-2 rounded-lg border px-3 py-2.5 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : isSuggested
                              ? 'border-orange-300 bg-orange-50'
                              : 'border-gray-200 bg-white'
                        }`}>
                        <View
                          className="h-6 w-6 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${category.color}26` }}>
                          <Ionicons name={category.icon as any} size={14} color={category.color} />
                        </View>
                        <Text
                          className={`text-[15px] ${
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

            {/* Helper Text */}
            {!productToEdit && name && (
              <View className="mx-4 mt-2">
                <Text className="text-[13px] leading-[18px] text-gray-500">
                  Tip: Category and unit are automatically suggested based on product name
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
