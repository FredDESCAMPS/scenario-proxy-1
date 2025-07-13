const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/test-auth', async (req, res) => {
  try {
    const key = process.env.SCENARIO_API_KEY;
    const secret = process.env.SCENARIO_API_SECRET;

    if (!key || !secret) {
      return res.status(500).json({ error: 'Clés API manquantes' });
    }

    const credentials = Buffer.from(`${key}:${secret}`).toString('base64');

    const response = await axios.get('https://api.cloud.scenario.com/v1/assets', {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ Erreur de test auth :', error.response?.data || error.message);
    res.status(500).json({
      error: 'Erreur lors du test d’authentification',
      details: error.response?.data || error.message
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Proxy actif sur le port ${port}`);
});
