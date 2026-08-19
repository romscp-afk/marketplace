import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { discountPercent, formatSoldCount } from "@/lib/shopee-theme";
import Colors from "@/constants/Colors";

interface ProductCardProps {
  product: Product;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
  variant?: "grid" | "flash";
}

function productImage(product: Product): string {
  if (product.images[0]) return product.images[0];
  return `https://picsum.photos/seed/${encodeURIComponent(product.slug)}/400/400`;
}

export function ProductCard({
  product,
  onToggleWishlist,
  isWishlisted,
  variant = "grid",
}: ProductCardProps) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const isFlash = variant === "flash";

  return (
    <Link href={`/product/${product.slug}`} asChild>
      <Pressable style={[styles.card, isFlash && styles.flashCard]}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: productImage(product) }} style={styles.image} resizeMode="cover" />
          {discount ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          ) : null}
          {product.seller.isVerified ? (
            <View style={styles.mallBadge}>
              <Text style={styles.mallText}>Mall</Text>
            </View>
          ) : null}
          {onToggleWishlist ? (
            <Pressable
              style={styles.wishlistBtn}
              onPress={() => onToggleWishlist()}
              hitSlop={8}
            >
              <Text style={styles.wishlistIcon}>{isWishlisted ? "♥" : "♡"}</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.body}>
          {!isFlash ? (
            <Text style={styles.title} numberOfLines={2}>
              {product.title}
            </Text>
          ) : null}

          <View style={styles.priceRow}>
            <Text style={styles.currency}>{product.currency === "SGD" ? "S$" : "$"}</Text>
            <Text style={styles.price}>
              {product.price.toFixed(product.price % 1 === 0 ? 0 : 2)}
            </Text>
          </View>

          {!isFlash && product.compareAtPrice && product.compareAtPrice > product.price ? (
            <Text style={styles.comparePrice}>
              {formatCurrency(product.compareAtPrice, product.currency)}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
            <Text style={styles.sold}>{formatSoldCount(product.reviewCount)}</Text>
          </View>

          {(product.price >= 25 || !product.deliveryFee) ? (
            <View style={styles.shipBadge}>
              <Text style={styles.shipText}>Free Shipping</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    overflow: "hidden",
    margin: 4,
  },
  flashCard: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: Colors.light.background,
    position: "relative",
  },
  image: { width: "100%", height: "100%" },
  discountBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.light.promotional,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottomLeftRadius: 4,
  },
  discountText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  mallBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: Colors.light.mall,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mallText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  wishlistBtn: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  wishlistIcon: { fontSize: 12, color: Colors.light.promotional },
  body: { padding: 8 },
  title: {
    fontSize: 13,
    color: Colors.light.text,
    lineHeight: 17,
    minHeight: 34,
  },
  priceRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 4 },
  currency: { fontSize: 12, color: Colors.light.tint, fontWeight: "600", marginTop: 2 },
  price: { fontSize: 18, color: Colors.light.tint, fontWeight: "700" },
  comparePrice: {
    fontSize: 11,
    color: Colors.light.textMuted,
    textDecorationLine: "line-through",
    marginTop: 2,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  rating: { fontSize: 11, color: Colors.light.textSecondary },
  sold: { fontSize: 11, color: Colors.light.textMuted },
  shipBadge: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: Colors.light.freeShip,
  },
  shipText: { fontSize: 10, color: Colors.light.freeShip, fontWeight: "600" },
});
