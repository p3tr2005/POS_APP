# 🧋 BOBA_GACOR_POS (V2.0)

> **STATUS:** PRODUCTION_READY // **STYLE:** NEO-BRUTALISM

Sistem Kasir (POS) dan Self-Service Menu untuk kedai Boba modern. Dibangun dengan fokus pada kecepatan transaksi, interaksi interaktif, dan notifikasi suara real-time.

---

## ⚡ TECH_STACK

- **Framework:** Next.js 16 (App Router + Proxy Middleware)
- **Database:** MySQL (via Drizzle ORM)
- **Styling:** Tailwind CSS (Neo-Brutalism Design)
- **State Management:** Zustand (Cart System)
- **Icons & Audio:** Lucide React + HTML5 Audio API
- **Real-time:** Polling System via Client Components

## 🛠️ KEY_FEATURES

### 1. CUSTOMER_INTERFACE (/menu/public)

- **Dynamic Catalog:** Menampilkan produk dari database.
- **Modifier System:** Kustomisasi gula, es, dan topping dengan modal interaktif.
- **Neo-Checkout:** Review pesanan dengan gaya visual yang berani.
- **Live Tracker:** Halaman status pesanan (`/order-status/[id]`) yang dilengkapi getar HP (Vibration API) dan notifikasi suara saat pesanan siap.

### 2. DASHBOARD_KASIR (/dashboard)

- **Live Order Feed:** Pantau pesanan masuk secara real-time.
- **Smart Audio Alert:** Dashboard akan bunyi "DING" hanya saat ada pesanan baru masuk (Memory-locked ID).
- **Order Management:** Ubah status pesanan (Process -> Ready -> Complete) atau Void/Cancel pesanan jika terjadi kesalahan.

### 3. BACKEND_LOGIC (Server Actions)

- **Atomic Transactions:** Menjamin data `orders` dan `orderItems` tersimpan secara utuh atau tidak sama sekali.
- **Middleware Proxy:** Melindungi rute dashboard admin namun tetap membuka akses publik untuk menu belanja.

---

## 🚀 INSTALLATION

1. **Clone & Install:**
   ```bash
   git clone [https://github.com/username/boba-gacor.git](https://github.com/p3tr2005/pos_app.git)
   cd boba-gacor
   npm install
   ```

## ENV

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000 # Base URL of your app
NEXT_PUBLIC_HOST=
```
