import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ProductCard } from "@/components/ProductCard";
import { LoadingView } from "@/components/LoadingView";
import { fetchProducts } from "@/lib/api";
import { useWishlist } from "@/contexts/wishlist-context";
import type { Product } from "@/lib/types";
import Colors from "@/constants/Colors";

export default function WishlistScreen() {
  const { productIds, isInWishlist, toggleWishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await fetchProducts({ limit: 48 });
      setProducts(result.data.filter((p) => productIds.includes(p.id)));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [productIds]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingView />;

  if (productIds.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={64} color={Colors.light.border} />
        <Text style={styles.emptyTitle}>No liked items yet</Text>
        <Text style={styles.emptyText}>Tap ♡ on products to save them here</Text>
        <Link href="/" asChild>
          <Pressable style={styles.shopBtn}>
            <Text style={styles.shopBtnText}>Discover Products</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <View style={styles.itemWrap}>
          <ProductCard
            product={item}
            isWishlisted={isInWishlist(item.id)}
            onToggleWishlist={() => toggleWishlist(item)}
          />
          <Pressable
            style={styles.removeBtn}
            onPress={() => removeFromWishlist(item.id)}
          >
            <Ionicons name="close-circle" size={22} color={Colors.light.textMuted} />
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  grid: { padding: 4, paddingBottom: 24 },
  row: { paddingHorizontal: 4 },
  itemWrap: { flex: 1, position: "relative" },
  removeBtn: { position: "absolute", top: 8, right: 12, zIndex: 2 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  emptyTitle: { marginTop: 16, fontSize: 18, fontWeight: "700", color: Colors.light.text },
  emptyText: { marginTop: 8, color: Colors.light.textSecondary, textAlign: "center" },
  shopBtn: {
    marginTop: 20,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  shopBtnText: { color: "#fff", fontWeight: "700" },
});
