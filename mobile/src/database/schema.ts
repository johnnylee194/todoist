import * as SQLite from 'expo-sqlite';

export async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync('data.db');

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT,
      color TEXT,
      order_val TEXT,
      is_deleted INTEGER DEFAULT 0,
      updated_at INTEGER,
      created_at INTEGER
    );

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
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (parent_id) REFERENCES tasks(id)
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT,
      color TEXT,
      is_deleted INTEGER DEFAULT 0,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS task_tags (
      id TEXT PRIMARY KEY,
      task_id TEXT,
      tag_id TEXT,
      is_deleted INTEGER DEFAULT 0,
      updated_at INTEGER,
      FOREIGN KEY (task_id) REFERENCES tasks(id),
      FOREIGN KEY (tag_id) REFERENCES tags(id)
    );
  `);

  return db;
}
