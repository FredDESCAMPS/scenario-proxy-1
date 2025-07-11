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
    const apiKey = process.env.SCENARIO_API_KEY;
    const apiSecret = process.env.SCENARIO_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('API Key ou Secret manquant');
    }

    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`
    };

    console.log("🔐 Authorization:", headers.Authorization);
    console.log("📦 Body:", req.body);

    const response = await axios.post(
      'https://api.app.scenario.com/v1/generation',
      req.body,
      { headers }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("❌ Erreur proxy :", err.response?.data || err.message);
    res.status(500).json({
      error: 'Erreur lors de la requête vers l\'API Scenario',
      details: err.response?.data || err.message
    });
  }
});

app.listen(port, () => {
  console.log("✅ Proxy actif sur le port " + port);
});
