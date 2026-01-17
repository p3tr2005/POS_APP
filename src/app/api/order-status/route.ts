import { NextResponse } from 'next/server';

import { db } from '@/database';
import { orders } from '@/database/models';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    columns: { status: true },
  });

  return NextResponse.json({ status: order?.status || 'NOT_FOUND' });
}
