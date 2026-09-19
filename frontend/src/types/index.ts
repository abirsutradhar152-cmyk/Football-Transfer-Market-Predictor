export interface Club {
  id: string;
  name: string;
  country: string;
  league: string;
  stadium: string;
  manager: string;
  logoUrl: string;
  estimatedBudget: number;
  wageBudget: number;
  tacticalStyle: string;
}

export interface PlayerStatistics {
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  xG: number;
  xA: number;
  shots: number;
  shotsOnTarget: number;
  keyPasses: number;
  passes: number;
  passAccuracy: number;
  progressivePasses: number;
  progressiveCarries: number;
  dribbles: number;
  tackles: number;
  interceptions: number;
  clearances: number;
  aerialDuels: number;
  cleanSheets: number;
}

export interface Player {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  nationality: string;
  position: string;
  preferredFoot: 'Right' | 'Left' | 'Both';
  height: number;
  currentClubId: string;
  shirtNumber: number;
  marketValue: number; // in Euros
  contractExpiry: string;
  salary?: number;
  imageUrl: string;
  statistics?: PlayerStatistics;
}

export interface Transfer {
  id: string;
  playerId: string;
  fromClubId: string;
  toClubId: string;
  season: string;
  transferFee: number;
  transferType: 'Permanent' | 'Loan' | 'Free Transfer' | 'Loan + Option' | 'Loan + Obligation';
  transferDate: string;
}

export interface TransferRumour {
  id: string;
  playerId: string;
  currentClubId: string;
  interestedClubId: string;
  source: string;
  sourceUrl?: string; // Optional because we don't invent them if not real
  publishedAt: string;
  lastUpdated: string;
  reliabilityScore: number; // 0-100
  status: 'Rumour' | 'Interest' | 'Contact' | 'Negotiation' | 'Bid' | 'Agreement' | 'Medical' | 'Completed' | 'Rejected' | 'Collapsed';
  transferProbability: number; // 0-100
}
