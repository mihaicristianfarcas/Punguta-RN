# Punguta React Native Implementation Plan

## Overview
Reimplementation of the Punguta iOS shopping list app in React Native using Expo and NativeWind (Tailwind CSS for React Native).

**Status**: Phase 1 - UI and Basic Functionality (No Database Persistence Yet)

## Swift App Analysis

### Core Features
- **3 Main Tabs**: Stores, Lists, Products
- **Global Products**: Products shared across all shopping lists
- **Shopping Lists**: Multiple lists with checked/unchecked items
- **Stores**: Physical store locations with custom category ordering
- **Categories**: 20 predefined categories with auto-categorization
- **Smart Organization**: Products organized by store layout

### Data Models
1. **Product** - Global product catalog with name, quantity (amount + unit), category
2. **ShoppingList** - Named lists with creation/update timestamps
3. **ShoppingListItem** - Junction table linking products to lists with checked state
4. **Category** - 20 predefined categories with keywords and default units
5. **Store** - Store info with type, location, and custom category ordering
6. **StoreType** - Enum: Grocery, Pharmacy, Hardware, Hypermarket

### Key UI Patterns
- Tab-based navigation
- Search and filter functionality
- Swipe actions for edit/delete
- Sheet modals for add/edit forms
- Progress tracking with visual indicators
- Empty states with call-to-action
- Grouped list displays by category
- Filter pills for category/status filtering

## Technology Stack

### Core
- **React Native**: v0.81.5
- **Expo**: ^54.0.0
- **TypeScript**: ~5.9.2
- **NativeWind**: latest (Tailwind CSS)

### Navigation & State
- **React Navigation** (to be installed)
- **React Context API** for state management (Phase 1)
- **AsyncStorage** (for future Phase 2)

### Additional Libraries (to be installed)
- **@react-navigation/native**: Tab and stack navigation
- **@react-navigation/bottom-tabs**: Bottom tab navigation
- **@react-navigation/native-stack**: Stack navigation
- **expo-location**: Store location features
- **react-native-maps**: Map integration for stores
- **@expo/vector-icons**: Icons

## Architecture

### Folder Structure
```
src/
├── components/
│   ├── shared/
│   │   ├── EmptyState.tsx
│   │   ├── FilterPill.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ProgressHeaderCard.tsx
│   │   ├── StatCard.tsx
│   │   ├── CategoryIcon.tsx
│   │   └── InteractiveProductCard.tsx
│   ├── products/
│   │   ├── ProductsList.tsx
│   │   └── AddEditProductForm.tsx
│   ├── lists/
│   │   ├── ListRow.tsx
│   │   ├── ListDetailHeader.tsx
│   │   └── AddEditListForm.tsx
│   └── stores/
│       ├── StoreRow.tsx
│       ├── StoreDetailHeader.tsx
│       ├── AddEditStoreForm.tsx
│       ├── CategorySelector.tsx
│       └── LocationPicker.tsx
├── screens/
│   ├── ProductsScreen.tsx
│   ├── ListsScreen.tsx
│   ├── ListDetailScreen.tsx
│   ├── StoresScreen.tsx
│   └── StoreDetailScreen.tsx
├── context/
│   ├── ProductContext.tsx
│   ├── ListContext.tsx
│   ├── StoreContext.tsx
│   └── CategoryContext.tsx
├── types/
│   ├── Product.ts
│   ├── ShoppingList.ts
│   ├── Store.ts
│   └── Category.ts
├── constants/
│   ├── categories.ts
│   ├── theme.ts
│   └── storeTypes.ts
├── utils/
│   ├── categoryHelper.ts
│   └── formatters.ts
└── navigation/
    └── AppNavigator.tsx
```

## Implementation Phases

### Phase 1: Foundation & Core UI (Current - No Persistence)

#### Milestone 1.1: Project Setup ✅
- [x] Verify Expo and NativeWind configuration
- [x] Install React Navigation dependencies
- [x] Install additional required packages
- [x] Set up folder structure
- [x] Configure TypeScript paths

#### Milestone 1.2: Type Definitions & Constants ✅
- [x] Define TypeScript interfaces for all models
- [x] Create categories constants with all 20 categories
- [x] Create store types constants
- [x] Create theme constants (colors, spacing, typography)
- [x] Create utility functions (formatters, helpers)

#### Milestone 1.3: State Management (In-Memory) ✅
- [x] Create ProductContext with in-memory state
- [x] Create ListContext with in-memory state
- [x] Create StoreContext with in-memory state
- [x] Create CategoryContext with predefined categories
- [x] Implement all CRUD operations in contexts

#### Milestone 1.4: Shared Components ✅
- [x] EmptyState component
- [x] FilterPill component
- [x] ProgressBar component
- [x] ProgressHeaderCard component
- [x] StatCard component
- [x] CategoryIcon component with all 20 category icons
- [ ] InteractiveProductCard component (will be created as needed)

#### Milestone 1.5: Products Feature ✅
- [x] ProductsScreen (main list view)
- [x] ProductsList component with category grouping
- [x] AddEditProductForm modal
- [x] Category auto-suggestion logic
- [x] Search functionality
- [x] Category filtering
- [x] Edit/delete actions with alerts

#### Milestone 1.6: Shopping Lists Feature ✅
- [x] ListsScreen (all lists view)
- [x] ListRow component with stats
- [x] ListDetailScreen with products
- [x] AddEditListForm modal
- [x] Add products to list
- [x] Check/uncheck items
- [x] Remove items from list
- [x] Progress tracking
- [x] Status filtering (active/completed)

#### Milestone 1.7: Stores Feature ✅
- [x] StoresScreen (all stores view)
- [x] StoreRow component
- [x] StoreDetailScreen with categorized products
- [x] AddEditStoreForm modal
- [x] Location picker (text-based)
- [x] Category display (default ordering)
- [x] Store type filtering
- [x] Basic location info display

#### Milestone 1.8: Navigation (Partial) ✅
- [x] Bottom tab navigator (3 tabs)
- [ ] Stack navigators for each tab (will add as needed)
- [ ] Modal presentations for forms
- [x] Navigation configuration
- [x] Tab bar styling

#### Milestone 1.9: Polish & Testing
- [ ] Test all CRUD operations
- [ ] Test navigation flows
- [ ] Test filtering and search
- [ ] Verify UI consistency
- [ ] Test on iOS and Android
- [ ] Handle edge cases (empty states, validation)

### Phase 2: Persistence (Future)
- [ ] Set up AsyncStorage
- [ ] Implement data persistence layer
- [ ] Add data migration utilities
- [ ] Test persistence across app restarts

### Phase 3: Advanced Features (Future)
- [ ] Offline sync queue
- [ ] Cloud sync
- [ ] Multi-device support
- [ ] Advanced map features
- [ ] Notifications

## Design Guidelines

### Color Scheme (from Swift AppTheme)
- **Primary Action**: Blue
- **Destructive**: Red
- **Warning**: Orange
- **Success**: Green
- **Card Background**: System background
- **Grouped Background**: System grouped background

### Spacing (px equivalents)
- xxs: 2
- xs: 4
- sm: 8
- md: 12
- lg: 20
- xl: 24
- xxl: 32

### Corner Radius
- sm: 8
- md: 12
- lg: 16
- xl: 20

### Icon Sizes
- sm: 16
- md: 20
- lg: 24
- xl: 30
- xxl: 40
- xxxl: 50
- huge: 60

### Category Colors & Icons
Each of the 20 categories has:
- **Custom color**: Matching the category theme
- **SF Symbol equivalent icon**: Will use Expo vector icons
- **Keywords**: For auto-categorization
- **Default unit**: kg, L, or pcs

### Categories List
1. Dairy - Cream color, drop icon
2. Produce - Green, carrot icon
3. Meat - Red, flame icon
4. Beverages - Blue, water bottle icon
5. Bakery - Brown, stove icon
6. Frozen - Ice blue, snowflake icon
7. Pantry - Brown, bag icon
8. Snacks - Golden, popcorn icon
9. Personal Care - Purple, sparkles icon
10. Cleaning - Clean blue, wind icon
11. Medicine - Red, cross vial icon
12. Vitamins - Green, pills icon
13. First Aid - Red cross, case icon
14. Beauty - Pink, eyebrow icon
15. Tools - Gray, hammer icon
16. Hardware - Steel gray, wrench icon
17. Paint - Paint blue, brush icon
18. Electrical - Yellow, bolt icon
19. Plumbing - Water blue, shower icon
20. Garden - Garden green, leaf icon

## Key Implementation Details

### Product Quantity
```typescript
interface ProductQuantity {
  amount: number;
  unit: string;
}
```

### Auto-Categorization
Match product name against category keywords (case-insensitive, supports English and Romanian)

### Store Category Ordering
- Each store maintains array of category IDs in custom order
- Products displayed in store detail follow this ordering
- Users can reorder via drag-and-drop

### Shopping List Items
- Junction model pattern
- Same product can be in multiple lists
- Checked state per list, not global

### Progress Tracking
- Count checked vs total items
- Visual progress bar
- Percentage completion
- Real-time updates

## Testing Checklist

### Products
- [ ] Create product with auto-categorization
- [ ] Edit product details
- [ ] Delete product
- [ ] Search products
- [ ] Filter by category
- [ ] View product in multiple lists

### Shopping Lists
- [ ] Create list
- [ ] Edit list name
- [ ] Delete list
- [ ] Add product to list
- [ ] Remove product from list
- [ ] Check/uncheck items
- [ ] View progress
- [ ] Filter by status

### Stores
- [ ] Create store
- [ ] Edit store details
- [ ] Delete store
- [ ] Select location
- [ ] Reorder categories
- [ ] View products by store layout
- [ ] Filter by store type

### General
- [ ] Tab navigation
- [ ] Search across all screens
- [ ] Empty states display correctly
- [ ] Forms validate input
- [ ] Swipe actions work
- [ ] Modals present/dismiss correctly

## Notes

- **Phase 1 Focus**: UI and basic functionality without persistence
- **Data Storage**: In-memory state via React Context
- **Reusable Components**: Emphasize component reusability
- **TypeScript**: Strict typing for all components and state
- **NativeWind**: Use Tailwind classes for styling
- **Accessibility**: Follow React Native accessibility guidelines
- **Performance**: Optimize list rendering with FlatList/SectionList

## Success Criteria for Phase 1

1. ✅ All 3 tabs functional with navigation
2. ✅ All CRUD operations working (in-memory)
3. ✅ Search and filter functionality
4. ✅ Auto-categorization working
5. ✅ Progress tracking accurate
6. ✅ UI matches Swift app design
7. ✅ Empty states implemented
8. ✅ Forms validate input
9. ✅ No critical bugs
10. ✅ Tested on both iOS and Android
