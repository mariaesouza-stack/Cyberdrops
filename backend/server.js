require('dotenv').config();
const cors = require('cors');
const express = require('express');
const offersRoutes = require('./routes/offers.routes');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'CyberDrops API' }));
app.use('/api/offers', offersRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno. O cache local continua disponível.' });
});

app.listen(port, () => console.log(`CyberDrops API disponível em http://localhost:${port}/api`));
