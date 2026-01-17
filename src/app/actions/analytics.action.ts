'use server';

import { db } from '@/database';
import { orderItems, orders } from '@/database/models';
import { and, desc, eq, gte, sql } from 'drizzle-orm';

export async function getDashboardStats(range: 'day' | 'week' | 'month' = 'day') {
  // Logic Tanggal
  let startDate = new Date();
  if (range === 'day') startDate.setHours(0, 0, 0, 0);
  if (range === 'week') startDate.setDate(startDate.getDate() - 7);
  if (range === 'month') startDate.setMonth(startDate.getMonth() - 1);

  const dateFilter = gte(orders.createdAt, startDate);

  // 1. Total Revenue dengan Filter
  const revenueResult = await db
    .select({
      total: sql<number>`sum(${orders.totalPrice})`,
    })
    .from(orders)
    .where(and(eq(orders.status, 'COMPLETED'), dateFilter));

  // 2. Total Orders dengan Filter
  const totalOrders = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(orders)
    .where(dateFilter);

  // 3. Best Selling Products dengan Filter
  const topProducts = await db
    .select({
      name: orderItems.productTitle,
      totalSold: sql<number>`sum(${orderItems.quantity})`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id)) // Join ke orders untuk filter tanggal
    .where(dateFilter)
    .groupBy(orderItems.productTitle)
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(5);

  return {
    revenue: Number(revenueResult[0]?.total || 0),
    orderCount: Number(totalOrders[0]?.count || 0),
    topProducts,
  };
}
