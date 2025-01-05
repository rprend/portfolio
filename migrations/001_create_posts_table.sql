CREATE TABLE IF NOT EXISTS posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  readTime TEXT
);

