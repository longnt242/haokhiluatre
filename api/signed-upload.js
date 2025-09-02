// api/signed-upload.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Bảo vệ bằng mật khẩu upload
  const pass = req.headers['x-upload-password'];
  if (!process.env.UPLOAD_PASSWORD || pass !== process.env.UPLOAD_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  const { bucket, filename, folder = '' } = req.body || {};
  if (!bucket || !filename) return res.status(400).json({ error: 'Missing bucket/filename' });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return res.status(500).json({ error: 'Missing Supabase env' });

  const supabase = createClient(url, serviceKey);

  // tạo path an toàn
  const trimSlashes = (s) => String(s || '').replace(/^\/*|\/*$/g, '');
  const safeFolder = trimSlashes(folder);
  const safeName = String(filename).replace(/[^\w.\-()[\] ]/g, '_');
  const path = safeFolder ? `${safeFolder}/${Date.now()}-${safeName}` : `${Date.now()}-${safeName}`;

  try {
    // xin URL ký upload
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
    if (error) return res.status(500).json({ error: error.message });

    // Vercel cần URL tuyệt đối để PUT trực tiếp (nếu bạn dùng fetch PUT)
    const storageUrl = `${url}/storage/v1`;
    const uploadUrl = data?.signedUrl ? storageUrl + data.signedUrl : null;

    return res.status(200).json({
      ok: true,
      path,
      uploadUrl,       // dùng nếu client đang fetch( uploadUrl, { method: 'PUT', body: file })
      token: data?.token // dùng nếu client gọi uploadToSignedUrl()
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}
