// api/content/[bucket].js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const { bucket } = req.query;
    if (!bucket) {
      return res.status(400).json({ ok: false, error: 'Missing bucket param' });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return res.status(500).json({
        ok: false,
        error: 'Missing Supabase env',
        hasUrl: !!url,
        hasServiceKey: !!serviceKey
      });
    }

    const supabase = createClient(url, serviceKey);

    // kiểm tra bucket có tồn tại không
    const { data: getBkt, error: getBktErr } = await supabase.storage.getBucket(bucket);
    if (getBktErr || !getBkt) {
      return res.status(500).json({
        ok: false,
        error: 'Bucket not found or cannot access',
        detail: getBktErr?.message,
        bucket
      });
    }

    // liệt kê file trong bucket
    const { data: list, error: listErr } = await supabase
      .storage
      .from(bucket)
      .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });

    if (listErr) {
      return res.status(500).json({ ok: false, error: listErr.message });
    }

    const items = (list || [])
      .filter(i => i?.name && !i.name.endsWith('/'))
      .map(i => {
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(i.name);
        return {
          name: i.name,
          path: i.name,
          url: pub?.publicUrl || null,
          size: i.metadata?.size ?? null,
          created_at: i.created_at ?? null,
        };
      });

    return res.status(200).json({ ok: true, count: items.length, items });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message || 'Server error' });
  }
}
