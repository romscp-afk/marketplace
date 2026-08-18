import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { LoadingView } from "@/components/LoadingView";
import { ProductCard } from "@/components/ProductCard";
import { fetchProduct } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import type { Product } from "@/lib/types";
import Colors from "@/constants/Colors";

function productImage(product: Product): string {
  return product.images[0] ?? `https://picsum.photos/seed/${encodeURIComponent(product.slug)}/600/600`;
}

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProduct(slug)
      .then((data) => {
        setProduct(data.product);
        setRelated(data.related);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingView />;
  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Product not found</Text>
      </View>
    );
  }

  const hasDeal = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: productImage(product) }} style={styles.hero} resizeMode="cover" />

      <View style={styles.body}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.seller}>{product.seller.storeName}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(product.price, product.currency)}</Text>
          {hasDeal ? (
            <Text style={styles.comparePrice}>
              {formatCurrency(product.compareAtPrice!, product.currency)}
            </Text>
          ) : null}
        </View>

        <Text style={styles.rating}>
          ★ {product.rating.toFixed(1)} · {product.reviewCount} reviews
        </Text>

        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.actions}>
          <Pressable
            style={styles.wishlistAction}
            onPress={() => toggleWishlist(product)}
          >
            <Text style={styles.wishlistText}>
              {isInWishlist(product.id) ? "♥ Saved" : "♡ Save"}
            </Text>
          </Pressable>
          <Pressable
            style={styles.addBtn}
            onPress={() => {
              addItem(product);
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
          >
            <Text style={styles.addBtnText}>{added ? "Added!" : "Add to cart"}</Text>
          </Pressable>
        </View>

        {related.length > 0 ? (
          <>
            <Text style={styles.relatedTitle}>Related products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {related.map((item) => (
                <View key={item.id} style={styles.relatedItem}>
                  <ProductCard product={item} />
                </View>
              ))}
            </ScrollView>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: Colors.light.error, fontSize: 16 },
  hero: { width: "100%", aspectRatio: 1, backgroundColor: Colors.light.border },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: Colors.light.text },
  seller: { marginTop: 6, color: Colors.light.textSecondary },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  price: { fontSize: 24, fontWeight: "700", color: Colors.light.text },
  comparePrice: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textDecorationLine: "line-through",
  },
  rating: { marginTop: 8, color: Colors.light.textSecondary },
  description: { marginTop: 16, lineHeight: 22, color: Colors.light.text },
  actions: { flexDirection: "row", gap: 10, marginTop: 20 },
  wishlistAction: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
    backgroundColor: Colors.light.surface,
  },
  wishlistText: { fontWeight: "600", color: Colors.light.text },
  addBtn: {
    flex: 2,
    padding: 14,
    borderRadius: 8,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
  },
  addBtnText: { fontWeight: "700", color: "#fff", fontSize: 16 },
  relatedTitle: {
    marginTop: 28,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  relatedItem: { width: 170, marginRight: 4 },
});
