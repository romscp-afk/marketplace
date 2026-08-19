# Marketplace Mobile (Expo)

Native companion app for the Marketplace web store. Uses the **same REST API** as the website so catalog, prices, and inventory stay in sync.

## Test with Expo Go

1. **Install Expo Go** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)).

2. **Start the web API** (if testing locally):
   ```bash
   cd ..
   npm run dev
   ```

3. **Configure the API URL** — copy env and set your machine's LAN IP for local dev:
   ```bash
   cp .env.example .env
   # EXPO_PUBLIC_APP_URL=http://192.168.x.x:3000
   ```

   For production (default), the app uses:
   `https://aromza.store`

4. **Start Expo**:
   ```bash
   npm install
   npm start
   ```

5. **Scan the QR code** in Expo Go. Phone and computer must be on the same Wi‑Fi for local dev.

## Sync with web

| Data | How it syncs |
|------|----------------|
| Products, categories, sellers | Same `/api/*` routes as web |
| Cart & wishlist keys | Same storage keys (`marketplace_cart`, `marketplace_wishlist`) — per device |
| Auth & checkout | Opens web in browser until Supabase mobile auth is wired |

After deploying new API routes, redeploy the web app so mobile picks up changes from production.

## Screens

- **Home** — featured, trending, deals, categories
- **Search** — query + sort filters
- **Product detail** — add to cart, wishlist
- **Cart** — quantity, totals (SGD)
- **Wishlist** — saved products
- **Account** — API status, links to web login/checkout

## Scripts

```bash
npm start          # Expo dev server (Expo Go)
npm run ios        # iOS simulator
npm run android    # Android emulator
```

## API endpoints used

- `GET /api/home`
- `GET /api/products`
- `GET /api/products/[slug]`
- `GET /api/categories/[slug]`
- `GET /api/health`

Built by [UXguard](https://uxguard.studio).
