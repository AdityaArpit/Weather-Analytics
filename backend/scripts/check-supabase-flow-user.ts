import 'dotenv/config';

/** One-off: inspect + delete the Supabase-flow test user. */
const base = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
const headers = { apikey: key!, Authorization: `Bearer ${key!}` };
const target = 'supabase.flow.test@resend.dev';

const list = await fetch(`${base}/auth/v1/admin/users?per_page=200`, { headers });
const data = (await list.json()) as {
  users?: Array<{ id: string; email?: string; email_confirmed_at?: string | null; created_at?: string }>;
};
const user = (data.users || []).find((u) => u.email === target);
if (!user) {
  console.log('test user not found');
  process.exit(0);
}
console.log('user:', user.email);
console.log('  email_confirmed_at:', user.email_confirmed_at ?? '(null — awaiting email confirm, as designed)');
console.log('  created_at:', user.created_at);

const del = await fetch(`${base}/auth/v1/admin/users/${user.id}`, { method: 'DELETE', headers });
console.log('deleted ->', del.status);
