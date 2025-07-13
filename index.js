const aws4 = require('aws4');
const https = require('https');
const axios = require('axios');
require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());

const key = process.env.SCENARIO_API_KEY;
const secret = process.env.SCENARIO_API_SECRET;

app.post('/proxy', async (req, res) => {
  const body = JSON.stringify(req.body);

  const opts = {
    host: 'api.cloud.scenario.com',
    path: '/v1/generation',
    service: 'execute-api',
    region: 'us-east-1',
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      'Host': 'api.cloud.scenario.com'
    }
  };

  aws4.sign(opts, { accessKeyId: key, secretAccessKey: secret });

  try {
    const response = await axios.post(`https://${opts.host}${opts.path}`, req.body, {
      headers: opts.headers
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Erreur proxy :", error.response?.data || error.message);
    res.status(500).json({
      error: 'Erreur lors de la requête vers l\'API Scenario',
      details: error.response?.data || error.message
    });
  }
});

app.listen(8080, () => {
  console.log("✅ Proxy actif sur le port 8080");
});
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
const credentials = Buffer.from(`${key}:${secret}`).toString('base64');

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${credentials}`
};

const response = await axios.post(
  'https://api.scenario.com/v1/generation',
  req.body,
  { headers }
);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('❌ Proxy error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Erreur lors de la requête vers l\'API Scenario',
      details: error.response?.data || error.message
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Proxy actif sur le port ${port}`);
});
