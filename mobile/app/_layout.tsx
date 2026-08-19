import { Stack } from "expo-router";
import Head from "expo-router/head";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { brand } from "@/lib/brand";
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
