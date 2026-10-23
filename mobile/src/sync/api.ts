const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const MOCK_TOKEN = 'mock-user-123';

export const pullSync = async (clientLastSync: number) => {
  const response = await fetch(`${API_URL}/api/sync/pull`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MOCK_TOKEN}`,
    },
    body: JSON.stringify({ client_last_sync: clientLastSync }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const pushSync = async (changes: any) => {
  const response = await fetch(`${API_URL}/api/sync/push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MOCK_TOKEN}`,
    },
    body: JSON.stringify(changes),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
