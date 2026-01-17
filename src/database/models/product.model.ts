import { relations } from 'drizzle-orm';
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

import { user } from './auth.model';

export const productModel = mysqlTable('products', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  price: int('price').notNull(),
  image: varchar('image', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // 'FOOD' atau 'DRINKS'
  description: varchar('description', { length: 255 }), // Misal: "Level pedas 1-5"
  // Add this column:
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// Tabel Order (Utama)
export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar('userId', { length: 255 }).notNull(), // ID Kasir yang melayani
  totalPrice: int('total_price').notNull(),
  status: varchar('status', { length: 50 }).default('PENDING'), // Misal: COMPLETED, CANCELLED
  type: varchar('type', { length: 20 }).default('TAKEAWAY'), // DINE_IN atau TAKEAWAY
  tableNumber: varchar('table_number', { length: 10 }), // Opsional jika pelanggan scan di meja
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabel Order Items (Detail)
export const orderItems = mysqlTable('order_items', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: varchar('orderId', { length: 128 }).notNull(), // Relasi ke tabel orders
  productId: varchar('productId', { length: 128 }).notNull(), // Relasi ke produk
  productTitle: varchar('product_title', { length: 255 }).notNull(), // Simpan nama saat dibeli (jika nanti nama produk berubah)
  quantity: int('quantity').notNull(),
  priceAtPointOfSale: int('price_at_pos').notNull(), // Harga saat transaksi (jika nanti harga naik)
});

export const productRelation = relations(productModel, ({ one }) => ({
  user: one(user, {
    fields: [productModel.userId],
    references: [user.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems), // Satu order punya banyak item
}));

// Relasi untuk Order Items
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(productModel, {
    fields: [orderItems.productId],
    references: [productModel.id],
  }),
}));
