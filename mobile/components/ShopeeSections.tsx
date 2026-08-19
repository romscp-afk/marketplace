import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import {
  flashSaleEndsAt,
  formatCountdown,
  shopee,
} from "@/lib/shopee-theme";
import Colors from "@/constants/Colors";

interface FlashSaleSectionProps {
  products: Product[];
}

export function FlashSaleSection({ products }: FlashSaleSectionProps) {
  const [endsAt] = useState(() => flashSaleEndsAt());
  const [countdown, setCountdown] = useState(() =>
    formatCountdown(endsAt.getTime() - Date.now()),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(formatCountdown(endsAt.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  if (!products.length) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="flash" size={18} color="#fff" />
          <Text style={styles.title}>Flash Sale</Text>
        </View>
        <View style={styles.timerRow}>
          <Text style={styles.endsIn}>Ends in</Text>
          <View style={styles.timerBox}>
            <Text style={styles.timer}>{countdown}</Text>
          </View>
        </View>
        <Link href="/search?sort=deals" asChild>
          <Pressable>
            <Text style={styles.seeAll}>See all ›</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        horizontal
        data={products.slice(0, 10)}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <ProductCard product={item} variant="flash" />
          </View>
        )}
      />
    </View>
  );
}

export function BannerCarousel() {
  return (
    <FlatList
      horizontal
      data={shopee.banners}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      contentContainerStyle={styles.bannerList}
      renderItem={({ item }) => (
        <View style={[styles.banner, { backgroundColor: item.color }]}>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerSub}>{item.subtitle}</Text>
        </View>
      )}
    />
  );
}

export function QuickActions() {
  const iconMap = {
    flash: "flash-outline",
    ticket: "ticket-outline",
    car: "car-outline",
    storefront: "storefront-outline",
    pricetag: "pricetag-outline",
  } as const;

  return (
    <View style={styles.actions}>
      {shopee.quickActions.map((action) => (
        <Link
          key={action.id}
          href={action.id === "mall" ? "/search?seller=verified" : "/search?sort=deals"}
          asChild
        >
          <Pressable style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: `${action.color}18` }]}>
              <Ionicons
                name={iconMap[action.icon]}
                size={22}
                color={action.color}
              />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.light.surface,
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: shopee.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  title: { color: "#fff", fontWeight: "800", fontSize: 16, fontStyle: "italic" },
  timerRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  endsIn: { color: "#fff", fontSize: 11 },
  timerBox: {
    backgroundColor: "#222",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  timer: { color: "#fff", fontSize: 12, fontWeight: "700", fontVariant: ["tabular-nums"] },
  seeAll: { marginLeft: "auto", color: "#fff", fontSize: 12 },
  list: { padding: 10, gap: 8 },
  cardWrap: { width: 130 },
  bannerList: { paddingHorizontal: 8, paddingVertical: 8, gap: 8 },
  banner: {
    width: 280,
    height: 100,
    borderRadius: 4,
    padding: 16,
    justifyContent: "center",
    marginRight: 8,
  },
  bannerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  bannerSub: { color: "rgba(255,255,255,0.9)", marginTop: 4, fontSize: 13 },
  actions: {
    flexDirection: "row",
    backgroundColor: Colors.light.surface,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  actionItem: { flex: 1, alignItems: "center" },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { marginTop: 6, fontSize: 10, color: Colors.light.text, textAlign: "center" },
});
