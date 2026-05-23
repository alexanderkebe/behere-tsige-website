export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // With JWT tokens, logout is handled client-side by removing the token
  // No server-side action needed
  res.json({ ok: true });
}
