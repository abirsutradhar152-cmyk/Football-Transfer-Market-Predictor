import { Router } from 'express';
import { players, clubs } from '../data/demo';

const router = Router();

// GET all players
router.get('/', (req, res) => {
  res.json(players);
});

// GET player by ID
router.get('/:id', (req, res) => {
  const player = players.find(p => p.id === req.params.id);
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  const club = clubs.find(c => c.id === player.currentClubId);
  res.json({ ...player, currentClub: club });
});

export default router;
