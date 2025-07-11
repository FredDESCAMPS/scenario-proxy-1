const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer api_vCyyEGdgfqTSkkuhgPBCpydz'
    };

    console.log("🟢 Requête vers Scenario avec headers:", headers);
    console.log("📦 Corps de la requête:", req.body);

    const response = await axios.post(
      'https://api.cloud.scenario.com/v1/generation',
      req.body,
      { headers }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Erreur proxy :", error.response?.data || error.message);
    res.status(500).json({
      error: "Erreur lors de la requête vers l'API Scenario",
      details: error.response?.data || error.message
    });
  }
});

app.listen(port, () => {
  console.log("✅ Proxy actif sur le port " + port);
});