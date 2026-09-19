import { Router } from 'express';
import { rumours } from '../data/demo';

const router = Router();

// GET all rumours
router.get('/', (req, res) => {
  res.json(rumours);
});

export default router;
