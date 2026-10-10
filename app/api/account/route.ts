import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// Deletes the caller's own account. Their rows in our tables go with it (on delete cascade).
export async function DELETE(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only: never use a NEXT_PUBLIC_ prefix for this
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  // Work out who is calling from their token. Never take the user id from the request body.
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id);
  if (deleteError) return NextResponse.json({ error: 'delete failed' }, { status: 500 });

  return NextResponse.json({ ok: true });
}