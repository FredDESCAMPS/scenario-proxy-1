const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
  try {
    const key = process.env.SCENARIO_API_KEY;
    const secret = process.env.SCENARIO_API_SECRET;

    // ⚠️ CORRECTION ICI : Encodage base64 sans package externe
    const credentials = Buffer.from(`${key}:${secret}`).toString('base64');
    const authHeader = `Basic ${credentials}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    };

    console.log("🔐 Clé API utilisée:", key);
    console.log("🔐 Secret utilisé:", secret);
    console.log("🔍 Header Authorization envoyé:", headers.Authorization);
    console.log("📦 Corps de la requête:", req.body);

    const response = await axios.post(
      'https://api.scenario.com/v1/generation',
      req.body,
      { headers }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Erreur proxy :", error.response?.data || error.message);
    res.status(500).json({
      error: 'Erreur lors de la requête vers l\'API Scenario',
      details: error.response?.data || error.message
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Proxy actif sur le port ${port}`);
});
