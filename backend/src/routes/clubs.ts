import { Router } from 'express';
import { clubs, players } from '../data/demo';

const router = Router();

// GET all clubs
router.get('/', (req, res) => {
  res.json(clubs);
});

// GET club by ID
router.get('/:id', (req, res) => {
  const club = clubs.find(c => c.id === req.params.id);
  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }
  const clubPlayers = players.filter(p => p.currentClubId === club.id);
  res.json({ ...club, players: clubPlayers });
});

export default router;
