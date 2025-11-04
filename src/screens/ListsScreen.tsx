import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLists } from '../context/ListContext';
import { useProducts } from '../context/ProductContext';
import { EmptyState } from '../components/shared/EmptyState';
import { FilterPill } from '../components/shared/FilterPill';
import { formatRelativeTime } from '../utils/formatters';
import { AddEditListForm } from '../components/lists/AddEditListForm';
import { ListDetailScreen } from './ListDetailScreen';
import { ShoppingList } from '../types/ShoppingList';

export function ListsScreen() {
  const { lists, listItems, deleteList } = useLists();
  const { products } = useProducts();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [listToEdit, setListToEdit] = useState<ShoppingList | undefined>();
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);

  // If a list is selected, show its detail view
  if (selectedList) {
    return <ListDetailScreen list={selectedList} onBack={() => setSelectedList(null)} />;
  }

  // Calculate stats for each list
  const getListStats = (listId: string) => {
    const items = listItems.filter((item) => item.shoppingListId === listId);
    const total = items.length;
    const completed = items.filter((item) => item.isChecked).length;
    return { total, completed };
  };

  // Filter lists
  const filteredLists = lists.filter((list) => {
    const matchesSearch = list.name.toLowerCase().includes(searchText.toLowerCase());

    if (statusFilter !== 'all') {
      const { total, completed } = getListStats(list.id);
      const isCompleted = total > 0 && completed === total;
      const isActive = total === 0 || completed < total;

      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'active' && !isActive) return false;
    }

    return matchesSearch;
  });

  // Sort by updatedAt
  const sortedLists = [...filteredLists].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      {/* Search Bar */}
      <View className="border-b border-gray-200 bg-white px-3 py-3">
        <View className="flex-row items-center rounded-lg bg-gray-100 px-3 py-2">
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            className="ml-2 flex-1 text-base"
            placeholder="Search lists"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-200 bg-white"
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}>
        <FilterPill
          title="All"
          isSelected={statusFilter === 'all'}
          onPress={() => setStatusFilter('all')}
        />
        <FilterPill
          title="Active"
          icon="ellipse-outline"
          color="#007AFF"
          isSelected={statusFilter === 'active'}
          onPress={() => setStatusFilter('active')}
        />
        <FilterPill
          title="Completed"
          icon="checkmark-circle"
          color="#34C759"
          isSelected={statusFilter === 'completed'}
          onPress={() => setStatusFilter('completed')}
        />
      </ScrollView>

      {/* Lists */}
      {sortedLists.length === 0 ? (
        <EmptyState
          icon={lists.length === 0 ? 'list' : 'search'}
          title={lists.length === 0 ? 'No Lists Yet' : 'No Results'}
          message={
            lists.length === 0
              ? 'Create your first shopping list to get started'
              : 'No lists found matching your criteria'
          }
        />
      ) : (
        <FlatList
          data={sortedLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item: list }) => {
            const { total, completed } = getListStats(list.id);
            const isCompleted = total > 0 && completed === total;

            return (
              <TouchableOpacity
                className="border-b border-gray-200 bg-white px-3 py-3"
                activeOpacity={0.7}
                onPress={() => setSelectedList(list)}>
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-lg font-semibold text-gray-800">{list.name}</Text>
                      {isCompleted && (
                        <View className="ml-2">
                          <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                        </View>
                      )}
                    </View>

                    <View className="mt-2 flex-row items-center">
                      <Text className="text-sm text-gray-600">
                        {total} {total === 1 ? 'item' : 'items'}
                      </Text>
                      {total > 0 && (
                        <>
                          <Text className="mx-2 text-sm text-gray-400">•</Text>
                          <Text className="text-sm text-gray-600">
                            {completed}/{total} completed
                          </Text>
                        </>
                      )}
                    </View>

                    <Text className="mt-2 text-xs text-gray-400">
                      Updated {formatRelativeTime(list.updatedAt)}
                    </Text>
                  </View>

                  <View className="ml-3 flex-row">
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setListToEdit(list);
                        setShowAddForm(true);
                      }}
                      className="p-2">
                      <Ionicons name="pencil-outline" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        Alert.alert(
                          'Delete List',
                          `Are you sure you want to delete "${list.name}"?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: () => deleteList(list.id),
                            },
                          ]
                        );
                      }}
                      className="ml-1 p-2">
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
        activeOpacity={0.8}
        onPress={() => {
          setListToEdit(undefined);
          setShowAddForm(true);
        }}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Form Modal */}
      <AddEditListForm
        visible={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setListToEdit(undefined);
        }}
        listToEdit={listToEdit}
      />
    </SafeAreaView>
  );
}
