import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import type { Category } from "@/lib/types";
import Colors from "@/constants/Colors";

function categoryImage(slug: string, imageUrl?: string) {
  return imageUrl ?? `https://picsum.photos/seed/cat-${slug}/120/120`;
}

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  return (
    <View style={styles.wrap}>
      {categories.map((cat) => (
        <Link key={cat.id} href={`/category/${cat.slug}`} asChild>
          <Pressable style={styles.item}>
            <View style={styles.iconWrap}>
              <Image
                source={{ uri: categoryImage(cat.slug, cat.imageUrl) }}
                style={styles.icon}
              />
            </View>
            <Text style={styles.label} numberOfLines={2}>
              {cat.name}
            </Text>
          </Pressable>
        </Link>
      ))}
      <Link href="/search" asChild>
        <Pressable style={styles.item}>
          <View style={[styles.iconWrap, styles.moreWrap]}>
            <Ionicons name="grid-outline" size={22} color={Colors.light.tint} />
          </View>
          <Text style={styles.label}>More</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: Colors.light.surface,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  item: {
    width: "20%",
    alignItems: "center",
    marginBottom: 8,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  moreWrap: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primaryLight,
    borderColor: Colors.light.primaryLight,
  },
  icon: { width: "100%", height: "100%" },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: Colors.light.text,
    textAlign: "center",
    paddingHorizontal: 2,
  },
});
