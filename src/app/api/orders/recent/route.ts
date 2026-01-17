import { NextResponse } from 'next/server';

import { db } from '@/database';
import { orders } from '@/database/models';
import { and, desc, gte, ne } from 'drizzle-orm';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await db.query.orders.findMany({
      // FILTER: Hari ini DAN status BUKAN 'COMPLETED' DAN status BUKAN 'CANCELLED'
      where: and(
        gte(orders.createdAt, today),
        ne(orders.status, 'COMPLETED'),
        ne(orders.status, 'CANCELLED')
      ),
      with: {
        items: true,
      },
      orderBy: [desc(orders.createdAt)],
      limit: 10,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data feed' }, { status: 500 });
  }
}
