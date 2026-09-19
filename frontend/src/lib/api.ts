const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  getPlayers: async () => {
    const res = await fetch(`${API_BASE_URL}/players`);
    return res.json();
  },
  getPlayer: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/players/${id}`);
    return res.json();
  },
  getClubs: async () => {
    const res = await fetch(`${API_BASE_URL}/clubs`);
    return res.json();
  },
  getClub: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/clubs/${id}`);
    return res.json();
  },
  getRumours: async () => {
    const res = await fetch(`${API_BASE_URL}/rumours`);
    return res.json();
  },
  getTransfers: async () => {
    const res = await fetch(`${API_BASE_URL}/transfers`);
    return res.json();
  },
  predictTransfer: async (playerId: string, targetClubId: string) => {
    const res = await fetch(`${API_BASE_URL}/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, targetClubId })
    });
    return res.json();
  },
  search: async (query: string) => {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return res.json();
  }
};
