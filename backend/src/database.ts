import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Create or connect to the SQLite database
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../data.db');
export const db = new Database(dbPath, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

export const initializeDatabase = () => {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password_hash TEXT,
      created_at INTEGER,
      is_deleted INTEGER DEFAULT 0,
      updated_at INTEGER
    )
  `);

  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT,
      color TEXT,
      order_val TEXT,
      is_deleted INTEGER DEFAULT 0,
      updated_at INTEGER,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      project_id TEXT,
      parent_id TEXT,
      content TEXT,
      description TEXT,
      priority INTEGER,
      due_date INTEGER,
      reminder_time INTEGER,
      status INTEGER DEFAULT 0,
      order_val TEXT,
      is_deleted INTEGER DEFAULT 0,
      updated_at INTEGER,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (parent_id) REFERENCES tasks(id)
    )
  `);

  // Create tags table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT,
      color TEXT,
      is_deleted INTEGER DEFAULT 0,
      updated_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create task_tags table
  db.exec(`
    CREATE TABLE IF NOT EXISTS task_tags (
      task_id TEXT,
      tag_id TEXT,
      is_deleted INTEGER DEFAULT 0,
      updated_at INTEGER,
      PRIMARY KEY (task_id, tag_id),
      FOREIGN KEY (task_id) REFERENCES tasks(id),
      FOREIGN KEY (tag_id) REFERENCES tags(id)
    )
  `);

  console.log('Database tables initialized.');
};

// Initialize the database schema
initializeDatabase();
