const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/sheets', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'individual_balance_2021.json'), 'utf-8'));
  const summary = Object.keys(data).map(name => ({ name, rows: data[name].length }));
  res.json(summary);
});

app.get('/api/sheet/:name', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'individual_balance_2021.json'), 'utf-8'));
  const name = req.params.name;
  if (!data[name]) return res.status(404).json({ error: 'Sheet not found' });
  res.json(data[name]);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
