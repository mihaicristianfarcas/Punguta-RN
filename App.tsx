import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { ProductProvider } from './src/context/ProductContext';
import { ListProvider } from './src/context/ListContext';
import { StoreProvider } from './src/context/StoreContext';
import { CategoryProvider } from './src/context/CategoryContext';
import { AppNavigator } from './src/navigation/AppNavigator';

import './global.css';

export default function App() {
  return (
    <CategoryProvider>
      <ProductProvider>
        <ListProvider>
          <StoreProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </StoreProvider>
        </ListProvider>
      </ProductProvider>
    </CategoryProvider>
  );
}
