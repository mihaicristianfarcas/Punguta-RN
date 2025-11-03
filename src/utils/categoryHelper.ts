import { CATEGORIES } from '../constants/categories';
import { Category } from '../types/Category';
import { ProductSuggestion } from '../types/Product';

/**
 * Suggests a category based on product name by matching keywords
 */
export function suggestCategory(productName: string): ProductSuggestion | null {
  const normalizedName = productName.toLowerCase().trim();

  if (!normalizedName) {
    return null;
  }

  // Find categories with matching keywords
  const matches: { category: Category; matchCount: number }[] = [];

  for (const category of CATEGORIES) {
    const matchingKeywords = category.keywords.filter((keyword) =>
      normalizedName.includes(keyword.toLowerCase())
    );

    if (matchingKeywords.length > 0) {
      matches.push({ category, matchCount: matchingKeywords.length });
    }
  }

  if (matches.length === 0) {
    return null;
  }

  // Sort by match count (more matches = higher confidence)
  matches.sort((a, b) => b.matchCount - a.matchCount);

  const bestMatch = matches[0];
  const confidence = Math.min(bestMatch.matchCount / 3, 1); // Cap at 1.0

  return {
    name: productName,
    suggestedCategoryId: bestMatch.category.id,
    suggestedUnit: bestMatch.category.defaultUnit || 'pcs',
    confidence,
  };
}

/**
 * Get category by ID
 */
export function getCategoryById(categoryId: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === categoryId);
}

/**
 * Get categories by IDs in specified order
 */
export function getCategoriesByIds(categoryIds: string[]): Category[] {
  return categoryIds
    .map((id) => getCategoryById(id))
    .filter((cat): cat is Category => cat !== undefined);
}
