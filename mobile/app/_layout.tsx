import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import Colors from "@/constants/Colors";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <CartProvider>
      <WishlistProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.light.surface },
            headerTintColor: Colors.light.text,
            contentStyle: { backgroundColor: Colors.light.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[slug]" options={{ title: "Product" }} />
          <Stack.Screen name="category/[slug]" options={{ title: "Category" }} />
        </Stack>
      </WishlistProvider>
    </CartProvider>
  );
}
