const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // important !
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // autorise toutes les origines
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
const PORT = process.env.PORT || 3000;

const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1359369765474271243/bT8eAOW0WgxazoUEKBMEis94CSw6Eg_Oo8eEmwxoQHXUwCay51AUY_u74ZoIZPyahpas'; // remplace par le tien

app.use(express.json());

app.post('/relay', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Le champ "content" est requis.' });
  }

  try {
    const discordRes = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (!discordRes.ok) {
      const text = await discordRes.text();
      console.error("❌ Erreur Discord :", text);
      return res.status(500).json({ error: 'Échec de l’envoi à Discord', details: text });
    }

    console.log("✅ Message envoyé à Discord :", content);
    res.json({ status: 'sent' });

  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ error: 'Erreur interne' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur proxy en ligne sur http://localhost:${PORT}/relay`);
});
