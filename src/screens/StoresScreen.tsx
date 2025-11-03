import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStores } from '../context/StoreContext';
import { StoreType, Store } from '../types/Store';
import { STORE_TYPE_DEFAULTS } from '../constants/storeTypes';
import { EmptyState } from '../components/shared/EmptyState';
import { FilterPill } from '../components/shared/FilterPill';
import { AddEditStoreForm } from '../components/stores/AddEditStoreForm';
import { StoreDetailScreen } from './StoreDetailScreen';

export function StoresScreen() {
  const { stores, deleteStore } = useStores();
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<StoreType | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [storeToEdit, setStoreToEdit] = useState<Store | undefined>();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // If a store is selected, show its detail view
  if (selectedStore) {
    return (
      <StoreDetailScreen
        store={selectedStore}
        onBack={() => setSelectedStore(null)}
      />
    );
  }

  // Filter stores
  const filteredStores = stores.filter(store => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchText.toLowerCase()) ||
      store.location.address?.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = !selectedType || store.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Sort alphabetically
  const sortedStores = [...filteredStores].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search stores"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200"
        contentContainerStyle={{ padding: 12, gap: 8 }}
      >
        <FilterPill
          title="All"
          isSelected={selectedType === null}
          onPress={() => setSelectedType(null)}
        />
        {Object.values(StoreType).map(type => (
          <FilterPill
            key={type}
            title={type}
            icon={STORE_TYPE_DEFAULTS[type].icon as any}
            color={STORE_TYPE_DEFAULTS[type].color}
            isSelected={selectedType === type}
            onPress={() => setSelectedType(selectedType === type ? null : type)}
          />
        ))}
      </ScrollView>

      {/* Stores List */}
      {sortedStores.length === 0 ? (
        <EmptyState
          icon={stores.length === 0 ? 'storefront' : 'search'}
          title={stores.length === 0 ? 'No Stores Yet' : 'No Results'}
          message={
            stores.length === 0
              ? 'Add your first store to start organizing your shopping'
              : 'No stores found matching your search'
          }
        />
      ) : (
        <FlatList
          data={sortedStores}
          keyExtractor={item => item.id}
          renderItem={({ item: store }) => (
            <TouchableOpacity
              className="bg-white border-b border-gray-200 px-4 py-4"
              activeOpacity={0.7}
              onPress={() => setSelectedStore(store)}
            >
              <View className="flex-row items-start">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${STORE_TYPE_DEFAULTS[store.type].color}20` }}
                >
                  <Ionicons
                    name={STORE_TYPE_DEFAULTS[store.type].icon as any}
                    size={24}
                    color={STORE_TYPE_DEFAULTS[store.type].color}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {store.name}
                  </Text>

                  {store.location.address && (
                    <Text className="text-sm text-gray-600 mt-1">
                      {store.location.address}
                    </Text>
                  )}

                  <Text className="text-xs text-gray-400 mt-2">
                    {store.categoryOrder.length}{' '}
                    {store.categoryOrder.length === 1 ? 'category' : 'categories'}
                  </Text>
                </View>

                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => {
                      setStoreToEdit(store);
                      setShowAddForm(true);
                    }}
                    className="p-2"
                    onPressIn={(e) => e.stopPropagation()}
                  >
                    <Ionicons name="pencil-outline" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Delete Store',
                        `Are you sure you want to delete "${store.name}"?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => deleteStore(store.id),
                          },
                        ]
                      );
                    }}
                    className="p-2 ml-1"
                    onPressIn={(e) => e.stopPropagation()}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
        onPress={() => {
          setStoreToEdit(undefined);
          setShowAddForm(true);
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Form Modal */}
      <AddEditStoreForm
        visible={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setStoreToEdit(undefined);
        }}
        storeToEdit={storeToEdit}
      />
    </SafeAreaView>
  );
}
