import type { ImageSourcePropType } from "react-native";

/** Bundled category thumbnails — keep in sync with public/images/categories */
const localCategoryImages: Record<string, ImageSourcePropType> = {
  fashion: require("@/assets/images/categories/fashion.jpg"),
  "home-living": require("@/assets/images/categories/home-living.jpg"),
  beauty: require("@/assets/images/categories/beauty.jpg"),
  electronics: require("@/assets/images/categories/electronics.jpg"),
  "food-gourmet": require("@/assets/images/categories/food-gourmet.jpg"),
  jewelry: require("@/assets/images/categories/jewelry.jpg"),
};

const defaultCategoryImage = localCategoryImages.fashion;

/** Prefer bundled assets; fall back to API-provided remote URL. */
export function getCategoryImageSource(
  slug: string,
  imageUrl?: string,
): ImageSourcePropType {
  const local = localCategoryImages[slug];
  if (local) return local;
  if (imageUrl) return { uri: imageUrl };
  return defaultCategoryImage;
}
