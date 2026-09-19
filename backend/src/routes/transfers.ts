import { Router } from 'express';
import { historicalTransfers } from '../data/demo';

const router = Router();

// GET all historical transfers
router.get('/', (req, res) => {
  res.json(historicalTransfers);
});

export default router;
