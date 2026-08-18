import { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { fetchHealth, getApiBaseUrl } from "@/lib/api";
import { brand } from "@/lib/brand";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import Colors from "@/constants/Colors";

export default function AccountScreen() {
  const { itemCount } = useCart();
  const { productIds } = useWishlist();
  const [health, setHealth] = useState<string>("checking...");
  const apiUrl = getApiBaseUrl();
  const webUrl = apiUrl;

  useEffect(() => {
    fetchHealth()
      .then((h) => setHealth(`${h.status} · supabase: ${h.platform.supabase}`))
      .catch(() => setHealth("offline"));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.greeting}>Welcome to {brand.name}</Text>
        <Text style={styles.sub}>Signed-in accounts sync when Supabase is connected.</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{itemCount}</Text>
          <Text style={styles.statLabel}>Cart items</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{productIds.length}</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </View>
      </View>

      <Pressable
        style={styles.action}
        onPress={() => WebBrowser.openBrowserAsync(`${webUrl}/account/login`)}
      >
        <Text style={styles.actionText}>Sign in on web</Text>
      </Pressable>

      <Pressable
        style={styles.action}
        onPress={() => WebBrowser.openBrowserAsync(`${webUrl}/checkout`)}
      >
        <Text style={styles.actionText}>Complete checkout on web</Text>
      </Pressable>

      <Pressable style={styles.action} onPress={() => Linking.openURL(brand.copyright.url)}>
        <Text style={styles.actionText}>Powered by {brand.copyright.holder}</Text>
      </Pressable>

      <View style={styles.meta}>
        <Text style={styles.metaLabel}>API</Text>
        <Text style={styles.metaValue}>{apiUrl}</Text>
        <Text style={styles.metaLabel}>Status</Text>
        <Text style={styles.metaValue}>{health}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, padding: 16 },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  greeting: { fontSize: 20, fontWeight: "700", color: Colors.light.text },
  sub: { marginTop: 6, color: Colors.light.textSecondary, lineHeight: 20 },
  stats: { flexDirection: "row", gap: 12, marginTop: 16 },
  stat: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statValue: { fontSize: 24, fontWeight: "700", color: Colors.light.tint },
  statLabel: { marginTop: 4, color: Colors.light.textSecondary, fontSize: 13 },
  action: {
    marginTop: 12,
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionText: { color: Colors.light.text, fontWeight: "600", fontSize: 15 },
  meta: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  metaLabel: { fontSize: 11, color: Colors.light.textSecondary, marginTop: 8 },
  metaValue: { fontSize: 13, color: Colors.light.text, marginTop: 2 },
});
