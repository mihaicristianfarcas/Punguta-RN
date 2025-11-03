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
import { useStores } from '../../context/StoreContext';
import { Store, StoreType } from '../../types/Store';
import { STORE_TYPE_DEFAULTS } from '../../constants/storeTypes';

interface AddEditStoreFormProps {
  visible: boolean;
  onClose: () => void;
  storeToEdit?: Store;
}

export function AddEditStoreForm({ visible, onClose, storeToEdit }: AddEditStoreFormProps) {
  const { addStore, updateStore } = useStores();

  const [name, setName] = useState('');
  const [type, setType] = useState<StoreType>(StoreType.GROCERY);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    if (storeToEdit) {
      setName(storeToEdit.name);
      setType(storeToEdit.type);
      setAddress(storeToEdit.location.address || '');
      setLatitude(storeToEdit.location.latitude.toString());
      setLongitude(storeToEdit.location.longitude.toString());
    } else {
      setName('');
      setType(StoreType.GROCERY);
      setAddress('');
      setLatitude('');
      setLongitude('');
    }
  }, [storeToEdit, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    // Default coordinates if not provided
    const lat = latitude ? parseFloat(latitude) : 0;
    const lng = longitude ? parseFloat(longitude) : 0;

    const location = {
      latitude: lat,
      longitude: lng,
      address: address.trim() || undefined,
    };

    if (storeToEdit) {
      updateStore(storeToEdit.id, {
        name: name.trim(),
        type,
        location,
      });
    } else {
      addStore(name.trim(), type, location);
    }

    onClose();
  };

  const handleClose = () => {
    setName('');
    setType(StoreType.GROCERY);
    setAddress('');
    setLatitude('');
    setLongitude('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="bg-white border-b border-gray-200 px-4 py-3">
            <View className="flex-row items-center justify-between mt-2">
              <TouchableOpacity onPress={handleClose} className="py-2">
                <Text className="text-blue-500 text-base">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold">
                {storeToEdit ? 'Edit Store' : 'New Store'}
              </Text>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!name.trim()}
                className="py-2"
              >
                <Text
                  className={`text-base font-semibold ${
                    name.trim() ? 'text-blue-500' : 'text-gray-400'
                  }`}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1">
            {/* Store Name */}
            <View className="bg-white mt-6 px-4 py-3">
              <Text className="text-xs text-gray-500 uppercase mb-2">Store Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Whole Foods Downtown"
                className="text-base text-gray-800"
                autoFocus={!storeToEdit}
              />
            </View>

            {/* Store Type */}
            <View className="bg-white mt-6 px-4 py-3">
              <Text className="text-xs text-gray-500 uppercase mb-3">Store Type</Text>
              <View className="flex-row flex-wrap gap-2">
                {Object.values(StoreType).map(storeType => {
                  const isSelected = type === storeType;
                  const typeConfig = STORE_TYPE_DEFAULTS[storeType];

                  return (
                    <TouchableOpacity
                      key={storeType}
                      onPress={() => setType(storeType)}
                      className={`flex-row items-center px-4 py-3 rounded-lg border ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center mr-2"
                        style={{ backgroundColor: `${typeConfig.color}20` }}
                      >
                        <Ionicons
                          name={typeConfig.icon as any}
                          size={18}
                          color={typeConfig.color}
                        />
                      </View>
                      <Text
                        className={`text-base ${
                          isSelected ? 'text-blue-700 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {storeType}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Location */}
            <View className="bg-white mt-6 px-4 py-3">
              <Text className="text-xs text-gray-500 uppercase mb-2">Address</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="e.g., 123 Main Street, City"
                className="text-base text-gray-800"
                multiline
              />
            </View>

            {/* Coordinates (Optional) */}
            <View className="bg-white mt-1 px-4 py-3">
              <Text className="text-xs text-gray-500 uppercase mb-2">
                Coordinates (Optional)
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 mb-1">Latitude</Text>
                  <TextInput
                    value={latitude}
                    onChangeText={setLatitude}
                    placeholder="0.0"
                    keyboardType="decimal-pad"
                    className="text-base text-gray-800"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 mb-1">Longitude</Text>
                  <TextInput
                    value={longitude}
                    onChangeText={setLongitude}
                    placeholder="0.0"
                    keyboardType="decimal-pad"
                    className="text-base text-gray-800"
                  />
                </View>
              </View>
            </View>

            {/* Info Box */}
            <View className="mt-4 mx-4 p-3 bg-blue-50 rounded-lg">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={16} color="#007AFF" />
                <Text className="text-xs text-blue-700 ml-2 flex-1">
                  Default categories for {type} stores will be set up automatically. You can
                  customize the order later to match your store's layout.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
