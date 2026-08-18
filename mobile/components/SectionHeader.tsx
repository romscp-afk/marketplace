import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {href ? (
        <Link href={href as never} asChild>
          <Pressable>
            <Text style={styles.link}>See all</Text>
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginTop: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  link: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.tint,
  },
});
