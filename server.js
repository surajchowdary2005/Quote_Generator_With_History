
const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Create SQLite database
const db = new Database("quotes.db");

// Create favorites table
db.exec(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(quote, author)
  )
`);

app.use(express.json());
app.use(express.static(__dirname));

// Fetch a random quote from a public API
app.get("/api/quote", async (req, res) => {
  try {
    const response = await fetch(
      "https://dummyjson.com/quotes/random"
    );

    if (!response.ok) {
      throw new Error("Quote API request failed");
    }

    const data = await response.json();

    res.json({
      quote: data.quote,
      author: data.author
    });
  } catch (error) {
    res.status(502).json({
      error: "Could not fetch a quote. Please try again."
    });
  }
});

// Save a favorite quote
app.post("/api/favorites", (req, res) => {
  const { quote, author } = req.body;

  if (
    typeof quote !== "string" ||
    typeof author !== "string" ||
    !quote.trim() ||
    !author.trim() ||
    quote.length > 2000 ||
    author.length > 200
  ) {
    return res.status(400).json({
      error: "Please provide a valid quote and author."
    });
  }

  try {
    const result = db.prepare(`
      INSERT OR IGNORE INTO favorites (quote, author)
      VALUES (?, ?)
    `).run(quote.trim(), author.trim());

    if (result.changes === 0) {
      return res.status(409).json({
        message: "This quote is already in your favorites."
      });
    }

    res.status(201).json({
      message: "Quote added to favorites!",
      id: result.lastInsertRowid
    });
  } catch (error) {
    res.status(500).json({
      error: "Could not save favorite."
    });
  }
});

// Get favorite quote history
app.get("/api/favorites", (req, res) => {
  try {
    const favorites = db.prepare(`
      SELECT id, quote, author, created_at
      FROM favorites
      ORDER BY id DESC
    `).all();

    res.json(favorites);
  } catch (error) {
    res.status(500).json({
      error: "Could not load favorites."
    });
  }
});

// Delete a favorite
app.delete("/api/favorites/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({
      error: "Invalid favorite ID."
    });
  }

  const result = db.prepare(
    "DELETE FROM favorites WHERE id = ?"
  ).run(id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Favorite not found."
    });
  }

  res.json({ message: "Favorite removed." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Quote Generator running at http://localhost:${PORT}`);
});
