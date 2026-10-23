import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { initializeDatabase } from '../database/schema';
import * as SQLite from 'expo-sqlite';

export function TestScreen() {
  const [status, setStatus] = useState<string>('Initializing database...');
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    async function setup() {
      try {
        const database = await initializeDatabase();
        setDb(database);
        setStatus('Database initialized successfully.');
      } catch (e) {
        setStatus(`Error initializing DB: ${String(e)}`);
      }
    }
    setup();
  }, []);

  const insertDummyProject = async () => {
    if (!db) return;
    try {
      const id = Math.random().toString(36).substring(7); // fake UUID
      const now = Date.now();
      await db.runAsync(
        'INSERT INTO projects (id, name, color, updated_at, created_at) VALUES (?, ?, ?, ?, ?)',
        id,
        'Test Project',
        '#FF0000',
        now,
        now
      );
      setStatus(`Inserted project with ID: ${id}`);
    } catch (e) {
      setStatus(`Error inserting row: ${String(e)}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
      <Button title="Insert Dummy Project" onPress={insertDummyProject} disabled={!db} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
