import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ProductCard } from "@/components/ProductCard";
import { LoadingView } from "@/components/LoadingView";
import { fetchCategory } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { useWishlist } from "@/contexts/wishlist-context";
import Colors from "@/constants/Colors";

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchCategory(slug)
      .then((data) => {
        setCategory(data.category);
        setProducts(data.products);
      })
      .catch(() => {
        setCategory(null);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{category?.name ?? slug}</Text>
        {category?.description ? (
          <Text style={styles.description}>{category.description}</Text>
        ) : null}
        <Text style={styles.count}>{products.length} products</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <Text style={styles.empty}>No products in this category yet.</Text>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isWishlisted={isInWishlist(item.id)}
            onToggleWishlist={() => toggleWishlist(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: "700", color: Colors.light.text },
  description: { marginTop: 6, color: Colors.light.textSecondary, lineHeight: 20 },
  count: { marginTop: 8, color: Colors.light.textSecondary, fontSize: 13 },
  grid: { padding: 6, paddingBottom: 24 },
  empty: { textAlign: "center", marginTop: 40, color: Colors.light.textSecondary },
});
