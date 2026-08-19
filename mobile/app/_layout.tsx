import { Platform } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import Colors from "@/constants/Colors";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

function WebHead() {
  if (Platform.OS !== "web") return null;
  const Head = require("expo-router/head").default;
  const { brand } = require("@/lib/brand");
  return (
    <Head>
      <title>{brand.share.title}</title>
      <meta name="description" content={brand.share.description} />
      <meta property="og:title" content={brand.share.title} />
      <meta property="og:description" content={brand.share.description} />
      <meta property="og:image" content={brand.share.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={brand.share.title} />
      <meta name="twitter:description" content={brand.share.description} />
      <meta name="twitter:image" content={brand.share.image} />
    </Head>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <CartProvider>
      <WishlistProvider>
        <WebHead />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.light.surface },
            headerTintColor: Colors.light.text,
            contentStyle: { backgroundColor: Colors.light.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[slug]" options={{ headerShown: false }} />
          <Stack.Screen name="category/[slug]" options={{ title: "Category" }} />
        </Stack>
      </WishlistProvider>
    </CartProvider>
  );
}
