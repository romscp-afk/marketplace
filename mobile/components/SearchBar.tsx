import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Colors from "@/constants/Colors";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  onPress?: () => void;
}

export function SearchBar({
  placeholder = "Search products, brands and more",
  value,
  onChangeText,
  editable = true,
  onPress,
}: SearchBarProps) {
  const inner = (
    <View style={styles.wrap}>
      <Ionicons name="search" size={18} color={Colors.light.textMuted} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.textMuted}
        value={value}
        onChangeText={onChangeText}
        editable={editable && !onPress}
        pointerEvents={onPress ? "none" : "auto"}
        returnKeyType="search"
      />
      <Ionicons name="camera-outline" size={20} color={Colors.light.textMuted} />
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {inner}
      </Pressable>
    );
  }

  return inner;
}

export function HomeSearchBar() {
  const router = useRouter();

  return (
    <Pressable style={styles.pressable} onPress={() => router.push("/search")}>
      <View style={styles.wrap} pointerEvents="none">
        <Ionicons name="search" size={18} color={Colors.light.textMuted} />
        <Text style={styles.placeholder}>Search products, brands and more</Text>
        <Ionicons name="camera-outline" size={20} color={Colors.light.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { flex: 1 },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 36,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    padding: 0,
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.textMuted,
  },
});
