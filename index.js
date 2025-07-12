const express = require('express');
const cors = require('cors');
const axios = require('axios');
const base64 = require('base-64');
const baseUrl = 'https://api.cloud.scenario.com/v1';

const app = express();
const port = 8080; // Port Railway ou local

app.use(cors());
app.use(express.json());

// ⚠️ Mets ici ta vraie API KEY et SECRET
const apiKey = 'api_yi6vWTk8pk5wbuhHvzwQApXC';
const apiSecret = 'Qr3oCfUVtcW3S8WnSCNaQzM9';

// Création du header d’authentification en Basic Auth (clé:secret en base64)
//const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
const authHeader = 'Basic ' + base64.encode(`${key}:${secret}`);

app.post('/proxy', async (req, res) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    };

    console.log("🔐 Header Authorization:", headers.Authorization);
    console.log("📦 Corps de la requête:", req.body);

    const response = await axios.post(
      'https://api.cloud.scenario.com/v1/',
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
  console.log("✅ Proxy actif sur le port " + port);
});
