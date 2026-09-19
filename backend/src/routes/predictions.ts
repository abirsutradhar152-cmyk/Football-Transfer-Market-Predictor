import { Router } from 'express';
import { players, clubs } from '../data/demo';
import type { Player, Club } from '../types';

export interface PredictionFactor {
  name: string;
  weight: number;
  score: number;
  positive: boolean;
  description: string;
}

export interface PredictionResult {
  probability: number;
  confidence: number;
  confidenceLabel: 'High' | 'Medium' | 'Low';
  difficulty: 'Low' | 'Moderate' | 'High' | 'Extreme';
  factors: PredictionFactor[];
}

const router = Router();

router.post('/', (req, res) => {
  const { playerId, targetClubId } = req.body;
  
  const player = players.find(p => p.id === playerId);
  const targetClub = clubs.find(c => c.id === targetClubId);
  const currentClub = clubs.find(c => c.id === player?.currentClubId);
  
  if (!player || !targetClub) {
    return res.status(400).json({ error: 'Invalid player or target club ID' });
  }

  // Tactical Compatibility (20%)
  const tacticalFitScore = Math.floor(Math.random() * 40) + 60; // 60-100
  // Club Need (15%)
  const clubNeedScore = Math.floor(Math.random() * 50) + 50; 
  // Financial Feasibility (15%)
  const financialScore = (targetClub.estimatedBudget > player.marketValue * 1.2) ? 90 : 50;
  // Player Interest (10%)
  const playerInterestScore = Math.floor(Math.random() * 40) + 50;
  // Club Interest (10%)
  const clubInterestScore = Math.floor(Math.random() * 30) + 70;
  // Contract Situation (10%)
  const contractScore = 80; // Example
  // Transfer Fee Feasibility (8%)
  const feeScore = financialScore > 70 ? 85 : 45;
  // Wage Compatibility (5%)
  const wageScore = 75;
  // Competition From Other Clubs (4%)
  const competitionScore = Math.floor(Math.random() * 100);
  // Injury / Availability (3%)
  const availabilityScore = 95;

  const totalScore = (
    tacticalFitScore * 0.20 +
    clubNeedScore * 0.15 +
    financialScore * 0.15 +
    playerInterestScore * 0.10 +
    clubInterestScore * 0.10 +
    contractScore * 0.10 +
    feeScore * 0.08 +
    wageScore * 0.05 +
    competitionScore * 0.04 +
    availabilityScore * 0.03
  );

  const probability = Math.round(totalScore);
  
  const factors: PredictionFactor[] = [
    { name: "Tactical Fit", weight: 20, score: tacticalFitScore, positive: tacticalFitScore > 70, description: tacticalFitScore > 70 ? "Strong tactical compatibility" : "System mismatch" },
    { name: "Club Need", weight: 15, score: clubNeedScore, positive: clubNeedScore > 75, description: clubNeedScore > 75 ? "Target club needs this position" : "Position already covered" },
    { name: "Financial Feasibility", weight: 15, score: financialScore, positive: financialScore > 60, description: financialScore > 60 ? "Financially feasible" : "High transfer fee constraint" },
    { name: "Player Interest", weight: 10, score: playerInterestScore, positive: playerInterestScore > 70, description: playerInterestScore > 70 ? "Player profile matches club strategy" : "Player may prefer other options" },
    { name: "Contract Situation", weight: 10, score: contractScore, positive: contractScore > 70, description: contractScore > 70 ? "Favourable contract situation" : "Contract complications" },
    { name: "Competition", weight: 4, score: competitionScore, positive: competitionScore < 50, description: competitionScore < 50 ? "Low competition" : "Competition from another club" },
  ];

  const result: PredictionResult = {
    probability,
    confidence: 82,
    confidenceLabel: 'High',
    difficulty: probability > 70 ? 'Moderate' : 'High',
    factors: factors.sort((a, b) => b.weight - a.weight)
  };

  res.json(result);
});

export default router;
