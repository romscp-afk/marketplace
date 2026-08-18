import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ProductCard } from "@/components/ProductCard";
import { LoadingView } from "@/components/LoadingView";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/contexts/wishlist-context";
import Colors from "@/constants/Colors";

const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Newest", value: "newest" },
  { label: "Popular", value: "popularity" },
  { label: "Rating", value: "rating" },
  { label: "Price ↑", value: "price_asc" },
  { label: "Price ↓", value: "price_desc" },
  { label: "Deals", value: "deals" },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const search = useCallback(async (q: string, s: string) => {
    setLoading(true);
    try {
      const result = await fetchProducts({
        q,
        sort: s || undefined,
        limit: 24,
      });
      setProducts(result.data);
      setTotal(result.total);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query, sort), 300);
    return () => clearTimeout(timer);
  }, [query, sort, search]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search products..."
        placeholderTextColor={Colors.light.textSecondary}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        returnKeyType="search"
      />

      <FlatList
        horizontal
        data={SORT_OPTIONS}
        keyExtractor={(item) => item.value || "default"}
        showsHorizontalScrollIndicator={false}
        style={styles.sortBar}
        contentContainerStyle={styles.sortContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.sortChip, sort === item.value && styles.sortChipActive]}
            onPress={() => setSort(item.value)}
          >
            <Text
              style={[styles.sortText, sort === item.value && styles.sortTextActive]}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
      />

      <Text style={styles.resultCount}>{total} products</Text>

      {loading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          ListEmptyComponent={
            <Text style={styles.empty}>No products found. Try another search.</Text>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              isWishlisted={isInWishlist(item.id)}
              onToggleWishlist={() => toggleWishlist(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  input: {
    margin: 12,
    padding: 14,
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    fontSize: 16,
    color: Colors.light.text,
  },
  sortBar: { maxHeight: 44 },
  sortContent: { paddingHorizontal: 12, gap: 8 },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginRight: 8,
  },
  sortChipActive: { backgroundColor: Colors.light.tint, borderColor: Colors.light.tint },
  sortText: { fontSize: 13, color: Colors.light.text },
  sortTextActive: { color: "#fff", fontWeight: "600" },
  resultCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: Colors.light.textSecondary,
    fontSize: 13,
  },
  grid: { paddingHorizontal: 6, paddingBottom: 24 },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: Colors.light.textSecondary,
    paddingHorizontal: 24,
  },
});
