import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

import { ProductCard } from "@/components/ProductCard";
import { LoadingView } from "@/components/LoadingView";
import { fetchProducts } from "@/lib/api";
import { useWishlist } from "@/contexts/wishlist-context";
import type { Product } from "@/lib/types";
import Colors from "@/constants/Colors";

export default function WishlistScreen() {
  const { productIds, isInWishlist, toggleWishlist } = useWishlist();
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
        <Text style={styles.emptyTitle}>No saved items yet</Text>
        <Text style={styles.emptyText}>Tap the heart on any product to save it here.</Text>
        <Link href="/search" asChild>
          <Pressable style={styles.shopBtn}>
            <Text style={styles.shopBtnText}>Browse products</Text>
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
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          isWishlisted={isInWishlist(item.id)}
          onToggleWishlist={() => toggleWishlist(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  grid: { padding: 6, paddingBottom: 24 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: Colors.light.text },
  emptyText: { marginTop: 8, color: Colors.light.textSecondary, textAlign: "center" },
  shopBtn: {
    marginTop: 20,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  shopBtnText: { color: "#fff", fontWeight: "700" },
});
