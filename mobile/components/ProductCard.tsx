import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import Colors from "@/constants/Colors";

interface ProductCardProps {
  product: Product;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
}

function productImage(product: Product): string {
  if (product.images[0]) return product.images[0];
  return `https://picsum.photos/seed/${encodeURIComponent(product.slug)}/400/400`;
}

export function ProductCard({ product, onToggleWishlist, isWishlisted }: ProductCardProps) {
  const hasDeal = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link href={`/product/${product.slug}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: productImage(product) }} style={styles.image} resizeMode="cover" />
          {hasDeal ? (
            <View style={styles.dealBadge}>
              <Text style={styles.dealText}>Deal</Text>
            </View>
          ) : null}
          {onToggleWishlist ? (
            <Pressable
              style={styles.wishlistBtn}
              onPress={(e) => {
                e.preventDefault?.();
                onToggleWishlist();
              }}
              hitSlop={8}
            >
              <Text style={styles.wishlistIcon}>{isWishlisted ? "♥" : "♡"}</Text>
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.seller} numberOfLines={1}>
          {product.seller.storeName}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(product.price, product.currency)}</Text>
          {hasDeal ? (
            <Text style={styles.comparePrice}>
              {formatCurrency(product.compareAtPrice!, product.currency)}
            </Text>
          ) : null}
        </View>
        <Text style={styles.rating}>★ {product.rating.toFixed(1)} ({product.reviewCount})</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
    margin: 6,
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: Colors.light.background,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dealBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: Colors.light.promotional,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dealText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  wishlistBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  wishlistIcon: {
    fontSize: 16,
    color: Colors.light.promotional,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 10,
    marginHorizontal: 10,
  },
  seller: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
    marginHorizontal: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    marginHorizontal: 10,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.text,
  },
  comparePrice: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textDecorationLine: "line-through",
  },
  rating: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
    marginBottom: 10,
    marginHorizontal: 10,
  },
});
