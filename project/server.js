import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

// --- locate database relative to this file ---
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const dbPath     = path.join(__dirname, 'database.db');

// --- open SQLite in read-only mode ---
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, err => {
  if (err) console.error('❌  SQLite error', err.message);
  else     console.log(`✅  SQLite connected: ${dbPath}`);
});

// ---------- API ----------
app.get('/api/werk/:id', (req, res) => {
  // for this demo “Werk 1” <=> Messstellen-ID 1
  const id = Number(req.params.id) || 1;

  const sql = `
    SELECT
        j.Institut                AS institut,
        j."Messstellen-ID"        AS messstellenId,
        j."Rech.Empf.-ID"         AS rechnungsempfaengerId,
        j."Letztverbraucher"      AS endConsumer
    FROM Jahresmessung j
    WHERE j."Messstellen-ID" = ?
    ORDER BY j.Jahr DESC
    LIMIT 1
  `;

  db.get(sql, [id], (err, row) => {
    if (err)   return res.status(500).json({ error: err.message });
    if (!row)  return res.status(404).json({ error: 'Werk not found' });

    res.json({
      werk: 'Hauptzähler',   // hard-coded label for the first Werk
      ...row
    });
  });
});

// ---------- start server ----------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀  API ready on http://localhost:${PORT}`));
