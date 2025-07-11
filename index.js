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
    const creds = Buffer.from(
      `${process.env.SCENARIO_API_KEY}:${process.env.SCENARIO_API_SECRET}`
    ).toString('base64');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${creds}`
    };

    console.log("🔐 Authorization header:", headers.Authorization);
    console.log("📦 Request body:", req.body);

    const response = await axios.post(
      'https://api.cloud.scenario.com/v1/generation',
      req.body,
      { headers }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("❌ Proxy error:", err.response?.data || err.message);
    res.status(500).json({
      error: 'Erreur proxy Scenario',
      details: err.response?.data || err.message
    });
  }
});

app.listen(port, () => console.log(`✅ Proxy listening on port ${port}`));
