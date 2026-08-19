import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

import { fetchHealth, getApiBaseUrl } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import Colors from "@/constants/Colors";

const MENU_ITEMS = [
  { icon: "bag-handle-outline" as const, label: "My Purchases", href: "orders" },
  { icon: "heart-outline" as const, label: "My Likes", href: "wishlist" },
  { icon: "ticket-outline" as const, label: "My Vouchers", href: "vouchers" },
  { icon: "star-outline" as const, label: "My Reviews", href: "reviews" },
  { icon: "help-circle-outline" as const, label: "Help Centre", href: "help" },
  { icon: "settings-outline" as const, label: "Settings", href: "settings" },
];

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();
  const { productIds } = useWishlist();
  const [health, setHealth] = useState("...");
  const webUrl = getApiBaseUrl();

  useEffect(() => {
    fetchHealth()
      .then((h) => setHealth(h.status))
      .catch(() => setHealth("offline"));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>Guest User</Text>
            <Pressable
              style={styles.loginBtn}
              onPress={() => WebBrowser.openBrowserAsync(`${webUrl}/account/login`)}
            >
              <Text style={styles.loginText}>Login / Sign Up</Text>
              <Ionicons name="chevron-forward" size={14} color="#fff" />
            </Pressable>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{itemCount}</Text>
            <Text style={styles.statLabel}>Cart</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{productIds.length}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Vouchers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>
      </View>

      <View style={styles.orderSection}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderTitle}>My Purchase</Text>
          <Text style={styles.orderLink}>View History ›</Text>
        </View>
        <View style={styles.orderIcons}>
          {[
            { icon: "wallet-outline", label: "To Pay" },
            { icon: "cube-outline", label: "To Ship" },
            { icon: "car-outline", label: "To Receive" },
            { icon: "star-outline", label: "To Review" },
          ].map((item) => (
            <Pressable key={item.label} style={styles.orderItem}>
              <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color={Colors.light.text} />
              <Text style={styles.orderLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            style={styles.menuItem}
            onPress={() => {
              if (item.href === "wishlist") return;
              WebBrowser.openBrowserAsync(`${webUrl}/account`);
            }}
          >
            <Ionicons name={item.icon} size={22} color={Colors.light.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} style={styles.menuArrow} />
          </Pressable>
        ))}
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaText}>API: {webUrl}</Text>
        <Text style={styles.metaText}>Status: {health}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: { flex: 1 },
  username: { color: "#fff", fontSize: 18, fontWeight: "700" },
  loginBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  loginText: { color: "#fff", fontSize: 13 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 4,
    marginTop: 16,
    paddingVertical: 14,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: Colors.light.tint },
  statLabel: { marginTop: 4, fontSize: 11, color: Colors.light.textSecondary },
  statDivider: { width: 1, backgroundColor: Colors.light.border },
  orderSection: {
    backgroundColor: Colors.light.surface,
    marginTop: 8,
    padding: 12,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  orderTitle: { fontWeight: "700", color: Colors.light.text },
  orderLink: { color: Colors.light.tint, fontSize: 13 },
  orderIcons: { flexDirection: "row", justifyContent: "space-around" },
  orderItem: { alignItems: "center", gap: 6 },
  orderLabel: { fontSize: 11, color: Colors.light.textSecondary },
  menu: {
    backgroundColor: Colors.light.surface,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  menuLabel: { flex: 1, fontSize: 14, color: Colors.light.text },
  menuArrow: { marginLeft: "auto" },
  meta: { padding: 16, alignItems: "center" },
  metaText: { fontSize: 11, color: Colors.light.textMuted },
});
