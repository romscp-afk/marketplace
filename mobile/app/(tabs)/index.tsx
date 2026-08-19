import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { HomeSearchBar } from "@/components/SearchBar";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import {
  BannerCarousel,
  FlashSaleSection,
  QuickActions,
} from "@/components/ShopeeSections";
import { ProductCard } from "@/components/ProductCard";
import { LoadingView } from "@/components/LoadingView";
import { fetchHome } from "@/lib/api";
import type { HomeResponse, Product } from "@/lib/types";
import { useWishlist } from "@/contexts/wishlist-context";
import Colors from "@/constants/Colors";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<HomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await fetchHome());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const feedProducts = useMemo(() => {
    if (!data) return [];
    const seen = new Set<string>();
    const merged: Product[] = [];
    for (const list of [
      data.sections.deals,
      data.sections.trending,
      data.sections.newArrivals,
      data.sections.featured,
    ]) {
      for (const p of list) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          merged.push(p);
        }
      }
    }
    return merged;
  }, [data]);

  if (loading) return <LoadingView />;

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Could not load store</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryBtn} onPress={load}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.logo}>Marketplace</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#fff" />
            <Ionicons name="cart-outline" size={22} color="#fff" style={styles.headerIconGap} />
          </View>
        </View>
        <HomeSearchBar />
      </View>

      <FlatList
        data={feedProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={Colors.light.tint}
          />
        }
        ListHeaderComponent={
          <View>
            <QuickActions />
            <CategoryCarousel categories={data.categories} />
            <BannerCarousel />
            <FlashSaleSection products={data.sections.deals} />
            <View style={styles.discoverHeader}>
              <Text style={styles.discoverTitle}>Daily Discover</Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  errorTitle: { fontSize: 18, fontWeight: "700", color: Colors.light.text },
  errorText: { marginTop: 8, color: Colors.light.textSecondary, textAlign: "center" },
  retryBtn: {
    marginTop: 16,
    backgroundColor: Colors.light.cartButton,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryText: { color: "#fff", fontWeight: "600" },
  header: {
    backgroundColor: Colors.light.header,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  logo: { color: "#fff", fontSize: 18, fontWeight: "800", fontStyle: "italic" },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  headerIconGap: { marginLeft: 16 },
  discoverHeader: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  discoverTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.header,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grid: { paddingBottom: 16 },
  row: { paddingHorizontal: 4 },
});
