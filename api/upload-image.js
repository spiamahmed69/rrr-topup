// Vercel Serverless Function — ImgBB আপলোড (অ্যাডমিন প্রোডাক্ট ছবি)।
// চাবি শুধু process.env.IMGBB_API_KEY থেকে — কোডে/রেপোতে কখনো নয়।
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'IMGBB_API_KEY is not configured on the server.' })
  }
  try {
    const { image } = req.body || {}
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ ok: false, error: 'No base64 image provided.' })
    }
    const form = new FormData()
    form.append('image', image.replace(/^data:image\/\w+;base64,/, ''))
    const r = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: form })
    const data = await r.json()
    if (!data?.success) {
      return res.status(502).json({ ok: false, error: data?.error?.message || 'ImgBB upload failed.' })
    }
    return res.status(200).json({ ok: true, url: data.data.url, deleteUrl: data.data.delete_url })
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) })
  }
}
