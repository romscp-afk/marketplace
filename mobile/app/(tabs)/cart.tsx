import { useMemo } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/lib/format";
import { brand } from "@/lib/brand";
import type { CartItem } from "@/lib/types";
import { productImageUrl } from "@/lib/images";
import Colors from "@/constants/Colors";

function productImage(slug: string, images: string[], categorySlug?: string) {
  return images[0] ?? productImageUrl(slug, 200, 200, categorySlug);
}

export default function CartScreen() {
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart();

  const grouped = useMemo(() => {
    const map = new Map<string, { sellerName: string; items: CartItem[] }>();
    for (const item of items) {
      const key = item.product.sellerId;
      const existing = map.get(key);
      if (existing) {
        existing.items.push(item);
      } else {
        map.set(key, {
          sellerName: item.product.seller.storeName,
          items: [item],
        });
      }
    }
    return Array.from(map.entries());
  }, [items]);

  if (itemCount === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="cart-outline" size={64} color={Colors.light.border} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add items to enjoy free shipping deals!</Text>
        <Link href="/" asChild>
          <Pressable style={styles.shopBtn}>
            <Text style={styles.shopBtnText}>Go Shopping</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  const deliveryFee =
    subtotal >= brand.delivery.freeShippingThreshold ? 0 : brand.delivery.defaultFee;
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.container}>
      <View style={styles.voucherRow}>
        <Ionicons name="ticket-outline" size={18} color={Colors.light.tint} />
        <Text style={styles.voucherText}>Select or enter voucher</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
      </View>

      <FlatList
        data={grouped}
        keyExtractor={([sellerId]) => sellerId}
        contentContainerStyle={styles.list}
        renderItem={({ item: [sellerId, group] }) => (
          <View style={styles.shopGroup}>
            <View style={styles.shopHeader}>
              <Ionicons name="storefront-outline" size={16} color={Colors.light.text} />
              <Text style={styles.shopName}>{group.sellerName}</Text>
            </View>
            {group.items.map((item) => {
              const price = item.selectedVariant?.price ?? item.product.price;
              return (
                <View key={item.id} style={styles.item}>
                  <View style={styles.checkbox}>
                    <Ionicons name="checkbox" size={20} color={Colors.light.tint} />
                  </View>
                  <Image
                    source={{
                      uri: productImage(
                        item.product.slug,
                        item.product.images,
                        item.product.categorySlug,
                      ),
                    }}
                    style={styles.thumb}
                  />
                  <View style={styles.itemBody}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {item.product.title}
                    </Text>
                    <Text style={styles.itemPrice}>
                      {formatCurrency(price, item.product.currency)}
                    </Text>
                    <View style={styles.qtyRow}>
                      <Pressable
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Text style={styles.qtyBtnText}>−</Text>
                      </Pressable>
                      <Text style={styles.qty}>{item.quantity}</Text>
                      <Pressable
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </Pressable>
                      <Pressable onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                        <Ionicons name="trash-outline" size={18} color={Colors.light.textMuted} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <View style={styles.selectAll}>
            <Ionicons name="checkbox" size={20} color={Colors.light.tint} />
            <Text style={styles.selectAllText}>Select All ({itemCount})</Text>
          </View>
          <View style={styles.totalWrap}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>
        {deliveryFee === 0 ? (
          <Text style={styles.freeShipNote}>🎉 You qualify for free shipping!</Text>
        ) : (
          <Text style={styles.freeShipNote}>
            Add {formatCurrency(brand.delivery.freeShippingThreshold - subtotal)} more for free
            shipping
          </Text>
        )}
        <Pressable style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Check Out ({itemCount})</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
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
    backgroundColor: Colors.light.cartButton,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 4,
  },
  shopBtnText: { color: "#fff", fontWeight: "700" },
  voucherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.light.surface,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  voucherText: { flex: 1, color: Colors.light.text, fontSize: 14 },
  list: { paddingBottom: 140 },
  shopGroup: {
    backgroundColor: Colors.light.surface,
    marginTop: 8,
  },
  shopHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  shopName: { fontWeight: "700", color: Colors.light.text, fontSize: 14 },
  item: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  checkbox: { justifyContent: "center", marginRight: 8 },
  thumb: { width: 80, height: 80, borderRadius: 4, backgroundColor: Colors.light.background },
  itemBody: { flex: 1, marginLeft: 10 },
  itemTitle: { fontSize: 13, color: Colors.light.text, lineHeight: 18 },
  itemPrice: { marginTop: 6, fontSize: 16, fontWeight: "700", color: Colors.light.price },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
  },
  qtyBtnText: { fontSize: 16, color: Colors.light.text },
  qty: { minWidth: 24, textAlign: "center", fontWeight: "600" },
  removeBtn: { marginLeft: "auto" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    padding: 12,
  },
  footerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  selectAll: { flexDirection: "row", alignItems: "center", gap: 8 },
  selectAllText: { fontSize: 13, color: Colors.light.text },
  totalWrap: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  totalLabel: { fontSize: 13, color: Colors.light.textSecondary },
  totalValue: { fontSize: 20, fontWeight: "800", color: Colors.light.price },
  freeShipNote: { marginTop: 6, fontSize: 12, color: Colors.light.freeShip },
  checkoutBtn: {
    marginTop: 10,
    backgroundColor: Colors.light.cartButton,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
