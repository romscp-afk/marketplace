import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { LoadingView } from "@/components/LoadingView";
import { ProductCard } from "@/components/ProductCard";
import { fetchProduct } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { discountPercent, formatSoldCount } from "@/lib/marketplace-ui";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import type { Product } from "@/lib/types";
import Colors from "@/constants/Colors";

function productImage(product: Product): string {
  return product.images[0] ?? `https://picsum.photos/seed/${encodeURIComponent(product.slug)}/600/600`;
}

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
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

  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
        <Image source={{ uri: productImage(product) }} style={styles.hero} resizeMode="cover" />

        <View style={styles.priceBlock}>
          {discount ? (
            <View style={styles.discountRow}>
              <Text style={styles.discountLabel}>-{discount}%</Text>
              <Text style={styles.flashLabel}>Flash Sale</Text>
            </View>
          ) : null}
          <View style={styles.priceRow}>
            <Text style={styles.currency}>S$</Text>
            <Text style={styles.price}>{product.price.toFixed(2)}</Text>
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <Text style={styles.comparePrice}>
                {formatCurrency(product.compareAtPrice, product.currency)}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
            <Text style={styles.divider}>|</Text>
            <Text style={styles.sold}>{formatSoldCount(product.reviewCount)}</Text>
            <Text style={styles.divider}>|</Text>
            <Pressable onPress={() => toggleWishlist(product)}>
              <Text style={styles.wishlist}>
                {isInWishlist(product.id) ? "♥ Saved" : "♡ Save"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.shipRow}>
            <Ionicons name="car-outline" size={16} color={Colors.light.freeShip} />
            <Text style={styles.shipText}>
              Free shipping on orders over S$70 · {product.deliveryEstimateDays.min}-
              {product.deliveryEstimateDays.max} days
            </Text>
          </View>

          <View style={styles.shopCard}>
            <View style={styles.shopInfo}>
              <View style={styles.shopAvatar}>
                <Text style={styles.shopInitial}>
                  {product.seller.storeName.charAt(0)}
                </Text>
              </View>
              <View>
                <View style={styles.shopNameRow}>
                  <Text style={styles.shopName}>{product.seller.storeName}</Text>
                  {product.seller.isVerified ? (
                    <View style={styles.mallTag}>
                      <Text style={styles.mallTagText}>Mall</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.shopMeta}>
                  ★ {product.seller.rating.toFixed(1)} · {product.seller.reviewCount} reviews
                </Text>
              </View>
            </View>
            <Pressable style={styles.visitShop}>
              <Text style={styles.visitShopText}>Visit Shop</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.description}>{product.description}</Text>

          {related.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>You May Also Like</Text>
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

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable style={styles.bottomIcon} onPress={() => router.push("/(tabs)")}>
          <Ionicons name="home-outline" size={22} color={Colors.light.textSecondary} />
          <Text style={styles.bottomIconLabel}>Home</Text>
        </Pressable>
        <Pressable style={styles.bottomIcon} onPress={() => toggleWishlist(product)}>
          <Ionicons
            name={isInWishlist(product.id) ? "heart" : "heart-outline"}
            size={22}
            color={isInWishlist(product.id) ? Colors.light.tint : Colors.light.textSecondary}
          />
          <Text style={styles.bottomIconLabel}>Save</Text>
        </Pressable>
        <View style={styles.qtyControl}>
          <Pressable onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>−</Text>
          </Pressable>
          <Text style={styles.qty}>{qty}</Text>
          <Pressable onPress={() => setQty(qty + 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.addCartBtn}
          onPress={() => addItem(product, undefined, qty)}
        >
          <Text style={styles.addCartText}>Add to Cart</Text>
        </Pressable>
        <Pressable
          style={styles.buyNowBtn}
          onPress={() => {
            addItem(product, undefined, qty);
            router.push("/(tabs)/cart");
          }}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  scroll: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: Colors.light.error, fontSize: 16 },
  hero: { width: "100%", aspectRatio: 1, backgroundColor: Colors.light.border },
  priceBlock: {
    backgroundColor: Colors.light.primaryLight,
    padding: 12,
  },
  discountRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  discountLabel: {
    backgroundColor: Colors.light.tint,
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  flashLabel: { color: Colors.light.tint, fontWeight: "700", fontSize: 13 },
  priceRow: { flexDirection: "row", alignItems: "flex-end", gap: 4 },
  currency: { color: Colors.light.price, fontWeight: "700", fontSize: 16, marginBottom: 4 },
  price: { color: Colors.light.price, fontWeight: "800", fontSize: 28 },
  comparePrice: {
    marginLeft: 8,
    marginBottom: 6,
    color: Colors.light.discount,
    textDecorationLine: "line-through",
    fontSize: 14,
  },
  body: { backgroundColor: Colors.light.surface, padding: 12, marginTop: 8 },
  title: { fontSize: 16, fontWeight: "500", color: Colors.light.productTitle, lineHeight: 22 },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 8 },
  rating: { color: Colors.light.tint, fontWeight: "600", fontSize: 13 },
  sold: { color: Colors.light.textMuted, fontSize: 13 },
  divider: { color: Colors.light.border },
  wishlist: { color: Colors.light.tint, fontSize: 13 },
  shipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 4,
  },
  shipText: { flex: 1, fontSize: 12, color: Colors.light.textSecondary },
  shopCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
  },
  shopInfo: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  shopAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    justifyContent: "center",
  },
  shopInitial: { color: "#fff", fontWeight: "700", fontSize: 16 },
  shopNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  shopName: { fontWeight: "700", color: Colors.light.text, fontSize: 14 },
  mallTag: { backgroundColor: Colors.light.mall, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2 },
  mallTagText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  shopMeta: { marginTop: 2, fontSize: 12, color: Colors.light.textMuted },
  visitShop: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  visitShopText: { color: Colors.light.tint, fontWeight: "600", fontSize: 12 },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.text,
  },
  description: { fontSize: 14, lineHeight: 21, color: Colors.light.textSecondary },
  relatedItem: { width: 150, marginRight: 4 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 8,
    paddingHorizontal: 8,
    gap: 6,
  },
  bottomIcon: { alignItems: "center", width: 44 },
  bottomIconLabel: { fontSize: 10, color: Colors.light.textMuted, marginTop: 2 },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
    marginLeft: 4,
  },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  qtyBtnText: { fontSize: 16, color: Colors.light.text },
  qty: { minWidth: 28, textAlign: "center", fontWeight: "600" },
  addCartBtn: {
    flex: 1,
    backgroundColor: Colors.light.cartButton,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  addCartText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  buyNowBtn: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buyNowText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
