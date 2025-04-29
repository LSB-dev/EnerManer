/* ------------------------------------------------------------------
   server.js  –  Express + SQLite back-end
   ------------------------------------------------------------------
   Endpoints
     GET  /api/werk/:id            -> meta data for Werk (Messstellen-ID)
     GET  /api/werk/:id/reports    -> list of quarterly reports
     POST /api/werk/:id/report     -> insert a quarterly report
   ------------------------------------------------------------------ */

   import express from 'express';
   import cors     from 'cors';
   import sqlite3  from 'sqlite3';
   import path     from 'path';
   import { fileURLToPath } from 'url';
   
   // ─────────────────────────────────────────────────────────────
   // Locate the database file
   // ─────────────────────────────────────────────────────────────
   const __filename = fileURLToPath(import.meta.url);
   const __dirname  = path.dirname(__filename);
   
   const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.db');
   
   // open in “serialize” mode so we can chain queries safely
   const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
     err => {
       if (err) {
         console.error('❌  SQLite error →', err.message);
         process.exit(1);
       }
       console.log(`✅  SQLite connected: ${DB_PATH}`);
     }
   );
   
   // Ensure the extra table exists exactly once
   db.serialize(() => {
     db.run(
       `CREATE TABLE IF NOT EXISTS QuarterlyReport (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            werkId        INTEGER NOT NULL,
            quarter       INTEGER NOT NULL,
            year          INTEGER NOT NULL,
            electricity   REAL    NOT NULL,
            gas           REAL    NOT NULL,
            submissionIso TEXT    NOT NULL,
            gasSupplier   TEXT    NOT NULL
        )`
     );
   });
   
   // ─────────────────────────────────────────────────────────────
   // Express app
   // ─────────────────────────────────────────────────────────────
   const app = express();
   app.use(cors());
   app.use(express.json());
   
   // ─────────────────────────────────────────────────────────────
   // GET  /api/werk/:id
   // ─────────────────────────────────────────────────────────────
   app.get('/api/werk/:id', (req, res) => {
     const werkId = Number(req.params.id) || 1;
   
     const sql = `
       SELECT Institut                AS institut,
              "Messstellen-ID"        AS messstellenId,
              "Rech.Empf.-ID"         AS rechnungsempfaengerId,
-             "Letztverbraucher"      AS endConsumer
         FROM Jahresmessung
        WHERE "Messstellen-ID" = ?
        ORDER BY Jahr DESC
        LIMIT 1
     `;
   
     db.get(sql, [werkId], (err, row) => {
       if (err)  return res.status(500).json({ error: err.message });
       if (!row) return res.status(404).json({ error: 'Werk not found' });
   
       res.json({
         werk: 'Hauptzähler',      // hard-coded label for Werk 1
         ...row
       });
     });
   });
   
   // ─────────────────────────────────────────────────────────────
   // GET  /api/werk/:id/reports
   // ─────────────────────────────────────────────────────────────
   app.get('/api/werk/:id/reports', (req, res) => {
     const werkId = Number(req.params.id) || 1;
   
     const sql = `
       SELECT id, quarter, year, electricity, gas, submissionIso, gasSupplier
         FROM QuarterlyReport
        WHERE werkId = ?
        ORDER BY year DESC, quarter DESC
     `;
   
     db.all(sql, [werkId], (err, rows) => {
       if (err) return res.status(500).json({ error: err.message });
   
       res.json(
         rows.map(r => ({
           id: r.id,
           quarter: r.quarter,
           year: r.year,
           electricity: r.electricity,
           gas: r.gas,
           submissionDate: r.submissionIso,
           gasSupplier: r.gasSupplier
         }))
       );
     });
   });
   
   // ─────────────────────────────────────────────────────────────
   // POST /api/werk/:id/report
   // ─────────────────────────────────────────────────────────────
   app.post('/api/werk/:id/report', (req, res) => {
     const werkId = Number(req.params.id) || 1;
     const { quarter, year, electricity, gas, gasSupplier } = req.body || {};
   
     if (
       ![quarter, year, electricity, gas].every(v => v !== undefined && v !== null)
     ) return res.status(400).json({ error: 'Missing fields in body' });
   
     const q  = Number(quarter);
     const yr = Number(year);
     const el = Number(electricity);
     const gs = Number(gas);
   
     if ([q, yr, el, gs].some(isNaN))
       return res.status(400).json({ error: 'quarter, year, electricity, gas must be numbers' });
   
     const submissionIso = new Date().toISOString().slice(0, 19); // YYYY-MM-DDTHH:MM:SS
   
     const sql = `
       INSERT INTO QuarterlyReport
         (werkId, quarter, year, electricity, gas, submissionIso, gasSupplier)
       VALUES (?,?,?,?,?,?,?)
     `;
   
     db.run(sql, [werkId, q, yr, el, gs, submissionIso, gasSupplier], function (err) {
       if (err) return res.status(500).json({ error: err.message });
   
       res.status(201).json({
         id: this.lastID,
         werkId,
         quarter: q,
         year: yr,
         electricity: el,
         gas: gs,
         submissionDate: submissionIso,
         gasSupplier: gasSupplier
       });
     });
   });
   
   // ─────────────────────────────────────────────────────────────
   // Start server
   // ─────────────────────────────────────────────────────────────
   const PORT = process.env.PORT || 3001;
   app.listen(PORT, () =>
     console.log(`🚀  API ready on http://localhost:${PORT}`)
   );
   