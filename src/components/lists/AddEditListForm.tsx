import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLists } from '../../context/ListContext';
import { ShoppingList } from '../../types/ShoppingList';

interface AddEditListFormProps {
  visible: boolean;
  onClose: () => void;
  listToEdit?: ShoppingList;
}

export function AddEditListForm({ visible, onClose, listToEdit }: AddEditListFormProps) {
  const { addList, updateList } = useLists();
  const [name, setName] = useState('');

  useEffect(() => {
    if (listToEdit) {
      setName(listToEdit.name);
    } else {
      setName('');
    }
  }, [listToEdit, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    if (listToEdit) {
      updateList(listToEdit.id, { name: name.trim() });
    } else {
      addList(name.trim());
    }

    onClose();
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

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
              <Text className="text-lg font-semibold">{listToEdit ? 'Edit List' : 'New List'}</Text>
              <TouchableOpacity onPress={handleSave} disabled={!name.trim()} className="py-2">
                <Text
                  className={`text-base font-semibold ${
                    name.trim() ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View className="mt-6 bg-white px-4 py-3">
            <Text className="mb-2 text-xs uppercase text-gray-500">List Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Weekly Groceries, Party Supplies"
              className="text-base text-gray-800"
              autoFocus={!listToEdit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
