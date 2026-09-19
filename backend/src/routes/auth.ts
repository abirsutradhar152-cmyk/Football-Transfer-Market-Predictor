import { Router } from 'express';

const router = Router();

// Mock Auth
router.post('/login', (req, res) => {
  res.json({ token: 'mock-jwt-token', user: { id: 'u1', name: 'Demo User' } });
});

router.post('/register', (req, res) => {
  res.json({ token: 'mock-jwt-token', user: { id: 'u2', name: 'New User' } });
});

export default router;
