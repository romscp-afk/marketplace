import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";
import { useCart } from "@/contexts/cart-context";
import { marketplaceUi } from "@/lib/marketplace-ui";

const tabLabels = Object.fromEntries(marketplaceUi.tabs.map((t) => [t.id, t.label]));

export default function TabLayout() {
  const { itemCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.header,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.light.surface,
          borderTopColor: Colors.light.border,
          height: 56,
          paddingBottom: 4,
        },
        tabBarLabelStyle: { fontSize: 10, marginTop: -2 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: tabLabels.home,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: tabLabels.mall,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-handle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: tabLabels.cart,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.light.header, fontSize: 10 },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          headerShown: true,
          headerStyle: { backgroundColor: Colors.light.header },
          headerTintColor: "#fff",
          headerTitle: "Shopping Cart",
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: tabLabels.noti,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          headerShown: true,
          headerStyle: { backgroundColor: Colors.light.header },
          headerTintColor: "#fff",
          headerTitle: "My Likes",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: tabLabels.me,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
