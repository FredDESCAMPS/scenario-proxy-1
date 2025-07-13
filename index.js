const express = require('express');
const cors = require('cors');
const axios = require('axios');
const aws4 = require('aws4');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
  try {
    const body = req.body;
    const apiHost = 'api.cloud.scenario.com';
    const apiPath = '/v1/generation';
    const url = `https://${apiHost}${apiPath}`;

    const opts = {
      host: apiHost,
      path: apiPath,
      method: 'POST',
      service: 'execute-api',
      region: 'us-east-1',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    aws4.sign(opts, {
      accessKeyId: process.env.SCENARIO_API_KEY,
      secretAccessKey: process.env.SCENARIO_API_SECRET
    });

    const response = await axios.post(url, body, {
      headers: opts.headers
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Erreur proxy :", error.response?.data || error.message);
    res.status(500).json({
      error: 'Erreur lors de la requête vers l'API Scenario',
      details: error.response?.data || error.message
    });
  }
});

app.listen(port, () => {
  console.log("✅ Proxy actif sur le port " + port);
});
