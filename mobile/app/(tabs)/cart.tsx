import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/lib/format";
import { brand } from "@/lib/brand";
import Colors from "@/constants/Colors";

function productImage(slug: string, images: string[]) {
  return images[0] ?? `https://picsum.photos/seed/${encodeURIComponent(slug)}/200/200`;
}

export default function CartScreen() {
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart();

  if (itemCount === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Browse products and add items to get started.</Text>
        <Link href="/search" asChild>
          <Pressable style={styles.shopBtn}>
            <Text style={styles.shopBtnText}>Start shopping</Text>
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
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const price = item.selectedVariant?.price ?? item.product.price;
          return (
            <View style={styles.item}>
              <Image
                source={{ uri: productImage(item.product.slug, item.product.images) }}
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
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>
            {deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <Text style={styles.note}>
          Checkout on web for now — cart uses the same storage keys as the website.
        </Text>
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
  list: { padding: 12 },
  item: {
    flexDirection: "row",
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 12,
    marginBottom: 10,
  },
  thumb: { width: 80, height: 80, borderRadius: 8, backgroundColor: Colors.light.background },
  itemBody: { flex: 1, marginLeft: 12 },
  itemTitle: { fontSize: 14, fontWeight: "600", color: Colors.light.text },
  itemPrice: { marginTop: 4, fontSize: 15, fontWeight: "700", color: Colors.light.text },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 8 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  qtyBtnText: { fontSize: 18, color: Colors.light.text },
  qty: { minWidth: 24, textAlign: "center", fontWeight: "600" },
  removeBtn: { marginLeft: "auto" },
  removeText: { color: Colors.light.error, fontSize: 13 },
  summary: {
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    padding: 16,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { color: Colors.light.textSecondary },
  summaryValue: { color: Colors.light.text, fontWeight: "600" },
  totalRow: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.light.border },
  totalLabel: { fontSize: 16, fontWeight: "700", color: Colors.light.text },
  totalValue: { fontSize: 16, fontWeight: "700", color: Colors.light.text },
  note: { marginTop: 12, fontSize: 12, color: Colors.light.textSecondary, textAlign: "center" },
});
