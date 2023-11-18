const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');

const app = express();
const port = 3000; 


const db = new Database(':memory:'); 


const stmt = db.prepare(`
  CREATE TABLE IF NOT EXISTS codes (
    id TEXT PRIMARY KEY,
    data TEXT,
    filename TEXT
  )
`);
stmt.run();

app.use(express.json());

app.get('/sharecode', (req, res) => {
  try {
    const { data, filename } = req.query;

    if (!data || !filename) {
      return res.status(400).json({ error: 'Both "data" and "filename" parameters are required.' });
    }

    
    const uniqueId = uuidv4();

    
    const insertStmt = db.prepare('INSERT INTO codes (id, data, filename) VALUES (?, ?, ?)');
    insertStmt.run(uniqueId, data, filename);

    I
    const host = req.get('host');
    const link = `http://${host}/code/${uniqueId}`;
    res.json({ link });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/code/:id', (req, res) => {
  try {
    const { id } = req.params;

    
    const selectStmt = db.prepare('SELECT data FROM codes WHERE id = ?');
    const row = selectStmt.get(id);

    if (!row) {
      res.status(404).json({ error: 'Code not found.' });
    } else {

      res.send(row.data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
             