export enum MCATSection {
  CP = "Chem/Phys (C/P)",
  BB = "Bio/Biochem (B/B)",
  PS = "Psych/Soc (P/S)",
}

export interface MCATQuestion {
  id: string;
  topic: string; 
  category: MCATSection; 
  scenarioText: string;      
  options: string[];           
  correctOption: string;       
  explanation: string;         
  distractorExplanations: Record<string, string>; 
}

export enum GameStatus {
  NOT_STARTED,
  SELECTING_SUBTOPIC, 
  PLAYING,
  SHOWING_ANSWER, 
  GAME_OVER,
  LOADING_CONTENT, 
}

export enum RankTier {
  UNRANKED = "Unranked",
  BRONZE = "Bronze",
  SILVER = "Silver",
  GOLD = "Gold",
  PLATINUM = "Platinum", // Kept for potential future use with 20Q
  DIAMOND = "Diamond",   // Kept for potential future use with 20Q
  ELITE = "Elite",
  CHAMPION = "Champion",
}

export interface SubTopicProgress {
  bestScore: number | null; // Best score achieved for this sub-topic
  rank: RankTier;
  quizzesTaken: number;
}

export interface SectionProgress {
  // Key is subTopic name or "General"
  [subTopicOrGeneral: string]: SubTopicProgress;
}

export interface UserProgress {
  sections: {
    // Key is MCATSection enum value
    [section: string]: SectionProgress; 
  };
  overallRank: RankTier;
}