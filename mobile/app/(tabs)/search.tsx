import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { LoadingView } from "@/components/LoadingView";
import { fetchProducts } from "@/lib/api";
import { marketplaceUi } from "@/lib/marketplace-ui";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/contexts/wishlist-context";
import Colors from "@/constants/Colors";

const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Top Sales", value: "popularity" },
  { label: "Latest", value: "newest" },
  { label: "Price ↑", value: "price_asc" },
  { label: "Price ↓", value: "price_desc" },
  { label: "Rating", value: "rating" },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const search = useCallback(async (q: string, s: string) => {
    setLoading(true);
    try {
      const result = await fetchProducts({ q, sort: s || undefined, limit: 32 });
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

  const showTrending = !query.trim();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      {showTrending ? (
        <View style={styles.trending}>
          <Text style={styles.trendingTitle}>Trending Searches</Text>
          <View style={styles.trendingChips}>
            {marketplaceUi.trendingSearches.map((term) => (
              <Pressable key={term} style={styles.trendChip} onPress={() => setQuery(term)}>
                <Ionicons name="trending-up" size={12} color={Colors.light.tint} />
                <Text style={styles.trendText}>{term}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.filterBar}>
        <FlatList
          horizontal
          data={SORT_OPTIONS}
          keyExtractor={(item) => item.value || "default"}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortContent}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.sortChip, sort === item.value && styles.sortChipActive]}
              onPress={() => setSort(item.value)}
            >
              <Text style={[styles.sortText, sort === item.value && styles.sortTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />
        <Pressable style={styles.filterBtn}>
          <Ionicons name="options-outline" size={16} color={Colors.light.text} />
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
      </View>

      <Text style={styles.resultCount}>{total} results</Text>

      {loading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
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
  header: {
    backgroundColor: Colors.light.header,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  trending: {
    backgroundColor: Colors.light.surface,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  trendingTitle: { fontSize: 13, fontWeight: "700", color: Colors.light.text, marginBottom: 8 },
  trendingChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  trendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  trendText: { fontSize: 12, color: Colors.light.text },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sortContent: { paddingHorizontal: 8, paddingVertical: 8 },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: Colors.light.background,
  },
  sortChipActive: { backgroundColor: Colors.light.primaryLight },
  sortText: { fontSize: 13, color: Colors.light.textSecondary },
  sortTextActive: { color: Colors.light.header, fontWeight: "700" },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
    paddingHorizontal: 12,
    borderLeftWidth: 1,
    borderLeftColor: Colors.light.border,
    height: "100%",
  },
  filterText: { fontSize: 13, color: Colors.light.text },
  resultCount: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.light.textMuted,
    backgroundColor: Colors.light.surface,
  },
  grid: { paddingBottom: 16 },
  row: { paddingHorizontal: 4 },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: Colors.light.textSecondary,
    paddingHorizontal: 24,
  },
});
