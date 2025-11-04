import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ProductsScreen } from '../screens/ProductsScreen';
import { ListsScreen } from '../screens/ListsScreen';
import { StoresScreen } from '../screens/StoresScreen';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
	return (
		<NavigationContainer>
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName: keyof typeof Ionicons.glyphMap;

						if (route.name === 'Stores') {
							iconName = focused ? 'storefront' : 'storefront-outline';
						} else if (route.name === 'Lists') {
							iconName = focused ? 'list' : 'list-outline';
						} else if (route.name === 'Products') {
							iconName = focused ? 'cart' : 'cart-outline';
						} else {
							iconName = 'help';
						}

						return <Ionicons name={iconName} size={size} color={color} />;
					},
					tabBarActiveTintColor: '#007AFF',
					tabBarInactiveTintColor: '#8e8e93',
					headerShown: true,
					animation: 'fade',
				})}>
				<Tab.Screen name="Stores" component={StoresScreen} />
				<Tab.Screen name="Lists" component={ListsScreen} />
				<Tab.Screen name="Products" component={ProductsScreen} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}
