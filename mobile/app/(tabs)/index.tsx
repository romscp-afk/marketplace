import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";

import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { LoadingView } from "@/components/LoadingView";
import { fetchHome } from "@/lib/api";
import { brand } from "@/lib/brand";
import type { HomeResponse, Product } from "@/lib/types";
import { useWishlist } from "@/contexts/wishlist-context";
import Colors from "@/constants/Colors";

function ProductRow({ products }: { products: Product[] }) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <FlatList
      horizontal
      data={products}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rowList}
      renderItem={({ item }) => (
        <View style={styles.rowItem}>
          <ProductCard
            product={item}
            isWishlisted={isInWishlist(item.id)}
            onToggleWishlist={() => toggleWishlist(item)}
          />
        </View>
      )}
    />
  );
}

export default function HomeScreen() {
  const [data, setData] = useState<HomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const home = await fetchHome();
      setData(home);
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
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
        setRefreshing(true);
        load();
      }} tintColor={Colors.light.tint} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{data.brand.tagline}</Text>
        <Text style={styles.heroSub}>
          Curated products in {data.brand.locale.currency}, delivered across Singapore.
        </Text>
        <Link href="/search" asChild>
          <Pressable style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>Shop now</Text>
          </Pressable>
        </Link>
      </View>

      {data.brand.announcement.enabled ? (
        <View style={styles.announcement}>
          <Text style={styles.announcementText}>{data.brand.announcement.message}</Text>
        </View>
      ) : null}

      <SectionHeader title="Categories" />
      <FlatList
        horizontal
        data={data.categories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <Link href={`/category/${item.slug}`} asChild>
            <Pressable style={styles.categoryChip}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </Pressable>
          </Link>
        )}
      />

      <SectionHeader title="Featured" href="/search?sort=rating" />
      <ProductRow products={data.sections.featured} />

      <SectionHeader title="Trending" href="/search?sort=popularity" />
      <ProductRow products={data.sections.trending} />

      <SectionHeader title="New arrivals" href="/search?sort=newest" />
      <ProductRow products={data.sections.newArrivals} />

      <SectionHeader title="Deals" href="/search?sort=deals" />
      <ProductRow products={data.sections.deals} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} {brand.copyright.holder}
        </Text>
      </View>
    </ScrollView>
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
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },
  hero: {
    backgroundColor: Colors.light.tint,
    padding: 24,
    paddingTop: 8,
  },
  heroTitle: { fontSize: 26, fontWeight: "700", color: "#fff", lineHeight: 32 },
  heroSub: { marginTop: 8, fontSize: 15, color: "rgba(255,255,255,0.85)" },
  heroBtn: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  heroBtnText: { color: Colors.light.text, fontWeight: "700" },
  announcement: {
    margin: 12,
    padding: 12,
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  announcementText: { color: Colors.light.text, fontSize: 13 },
  categoryList: { paddingHorizontal: 12, paddingBottom: 4 },
  categoryChip: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryText: { color: Colors.light.text, fontWeight: "600" },
  rowList: { paddingHorizontal: 6 },
  rowItem: { width: 170 },
  footer: { padding: 24, alignItems: "center" },
  footerText: { color: Colors.light.textSecondary, fontSize: 12 },
});
