import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { Category } from "@/lib/types";
import Colors from "@/constants/Colors";

function categoryImage(slug: string, imageUrl?: string) {
  return imageUrl ?? `https://picsum.photos/seed/cat-${slug}/120/120`;
}

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      {categories.map((cat) => (
        <Pressable
          key={cat.id}
          style={styles.item}
          onPress={() => router.push(`/category/${cat.slug}`)}
        >
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
      ))}
      <Pressable style={styles.item} onPress={() => router.push("/search")}>
        <View style={styles.moreIconWrap}>
          <Ionicons name="grid-outline" size={22} color={Colors.light.tint} />
        </View>
        <Text style={styles.label}>More</Text>
      </Pressable>
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
  moreIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primaryLight,
    borderWidth: 1,
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
