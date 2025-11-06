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

    // Reset form state
    setName('');
    
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        className="flex-1">
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="border-b border-gray-200 bg-white px-4 pb-3 pt-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={handleClose} className="py-2">
                <Text className="text-[17px] text-blue-500">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-[17px] font-semibold">{listToEdit ? 'Edit List' : 'New List'}</Text>
              <TouchableOpacity onPress={handleSave} disabled={!name.trim()} className="py-2">
                <Text
                  className={`text-[17px] font-semibold ${
                    name.trim() ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                  {listToEdit ? 'Save' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View className="mt-8 bg-white px-4 py-3">
            <Text className="mb-2 text-[13px] font-normal uppercase tracking-wide text-gray-500">
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="List Name"
              placeholderTextColor="#999999"
              className="text-[17px] text-gray-900"
              autoFocus={!listToEdit}
              autoCorrect={false}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
