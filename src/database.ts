import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('hackernews.db', (err) => {
	if (err) {
		console.error('Error opening database:', err.message);
	} else {
		console.log('Connected to the SQLite database.');
		db.run(`CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`);
	}
});

export default db;