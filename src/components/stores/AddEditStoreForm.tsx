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

    // Reset form state
    setName('');
    setType(StoreType.GROCERY);
    setAddress('');
    setLatitude('');
    setLongitude('');
    
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
                {storeToEdit ? 'Edit Store' : 'New Store'}
              </Text>
              <TouchableOpacity onPress={handleSave} disabled={!name.trim()} className="py-2">
                <Text
                  className={`text-[17px] font-semibold ${
                    name.trim() ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                  {storeToEdit ? 'Save' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
            {/* Store Details Section */}
            <View className="mt-8 bg-white px-4 py-3">
              <Text className="mb-2 text-[13px] font-normal uppercase tracking-wide text-gray-500">
                Store Details
              </Text>
            </View>

            {/* Store Name */}
            <View className="bg-white px-4 py-3">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Store Name"
                placeholderTextColor="#999999"
                className="text-[17px] text-gray-900"
                autoFocus={!storeToEdit}
                autoCorrect={false}
              />
            </View>

            {/* Store Type */}
            <View className="mt-8 bg-white px-4 py-3">
              <Text className="mb-3 text-[13px] font-normal uppercase tracking-wide text-gray-500">
                Type
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {Object.values(StoreType).map((storeType) => {
                  const isSelected = type === storeType;
                  const typeConfig = STORE_TYPE_DEFAULTS[storeType];

                  return (
                    <TouchableOpacity
                      key={storeType}
                      onPress={() => setType(storeType)}
                      className={`flex-row items-center gap-2 rounded-lg border px-3 py-3 ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                      }`}>
                      <View
                        className="h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${typeConfig.color}26` }}>
                        <Ionicons
                          name={typeConfig.icon as any}
                          size={18}
                          color={typeConfig.color}
                        />
                      </View>
                      <Text
                        className={`text-[15px] ${
                          isSelected ? 'font-semibold text-blue-700' : 'text-gray-700'
                        }`}>
                        {storeType}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Location Section */}
            <View className="mt-8 bg-white px-4 py-3">
              <Text className="mb-2 text-[13px] font-normal uppercase tracking-wide text-gray-500">
                Location
              </Text>
            </View>

            {/* Address */}
            <View className="bg-white px-4 py-3">
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
                placeholderTextColor="#999999"
                className="text-[17px] text-gray-900"
                multiline
                autoCorrect={false}
              />
            </View>

            {/* Coordinates */}
            <View className="mt-1 flex-row gap-3 bg-white px-4 py-3">
              <View className="flex-1">
                <Text className="mb-1 text-[13px] text-gray-500">Latitude</Text>
                <TextInput
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="0.0"
                  placeholderTextColor="#999999"
                  keyboardType="decimal-pad"
                  className="text-[17px] text-gray-900"
                />
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-[13px] text-gray-500">Longitude</Text>
                <TextInput
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="0.0"
                  placeholderTextColor="#999999"
                  keyboardType="decimal-pad"
                  className="text-[17px] text-gray-900"
                />
              </View>
            </View>

            {/* Helper Text */}
            <View className="mx-4 mt-2">
              <Text className="text-[13px] leading-[18px] text-gray-500">
                Default categories for {type} stores will be set up automatically. You can
                customize the order later to match your store&apos;s layout.
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
