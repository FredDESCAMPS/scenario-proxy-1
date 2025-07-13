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
    const apiKey = process.env.SCENARIO_API_KEY;
    const apiSecret = process.env.SCENARIO_API_SECRET;

    const body = JSON.stringify(req.body);

    const opts = {
      host: 'api.cloud.scenario.com',
      path: '/v1/generation',
      service: 'execute-api',
      region: 'us-east-1',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    };

    aws4.sign(opts, {
      accessKeyId: apiKey,
      secretAccessKey: apiSecret,
    });

    const response = await axios.post(
      'https://api.cloud.scenario.com/v1/generation',
      req.body,
      {
        headers: opts.headers,
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('❌ Erreur proxy :', error.response?.data || error.message);
    res.status(500).json({
      error: "Erreur lors de la requête vers l'API Scenario",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Proxy actif sur le port ${port}`);
});
