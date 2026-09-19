import { Router } from 'express';
import { players, clubs } from '../data/demo';

const router = Router();

router.get('/', (req, res) => {
  const q = req.query.q as string;
  if (!q) {
    return res.json({ players: [], clubs: [] });
  }

  const query = q.toLowerCase();
  
  const matchedPlayers = players.filter(p => p.name.toLowerCase().includes(query));
  const matchedClubs = clubs.filter(c => c.name.toLowerCase().includes(query));

  res.json({
    players: matchedPlayers,
    clubs: matchedClubs
  });
});

export default router;
