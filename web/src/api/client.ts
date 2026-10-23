const API_URL = '/api/sync';
const MOCK_TOKEN = 'mock-user-123';

export const fetchData = async () => {
  const response = await fetch(`${API_URL}/pull`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MOCK_TOKEN}`,
    },
    body: JSON.stringify({ client_last_sync: 0 }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const pushData = async (changes: any) => {
  const response = await fetch(`${API_URL}/push`, {
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
