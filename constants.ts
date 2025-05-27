import { MCATSection, RankTier } from './types';

export const QUESTIONS_PER_SESSION = 5; 

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const SECTION_ICONS_MAP: Record<MCATSection, string> = {
  [MCATSection.CP]: "AtomIcon", 
  [MCATSection.BB]: "DnaIcon", 
  [MCATSection.PS]: "BrainIcon", 
};

export const MCAT_SUBTOPICS: Record<MCATSection, string[]> = {
  [MCATSection.CP]: [
    "Translational Motion, Work, Energy, and Force",
    "Fluids (Density, Pressure, Buoyancy, Flow)",
    "Electrostatics and Magnetism",
    "Electric Circuits (Current, Resistance, Voltage, Capacitance)",
    "Light and Optics (Reflection, Refraction, Lenses, Mirrors)",
    "Atomic and Nuclear Phenomena (Radioactive Decay, Half-life)",
    "Thermodynamics (Heat, Temperature, Enthalpy, Entropy)",
    "Solutions (Concentration, Colligative Properties)",
    "Acids and Bases (pH, pKa, Buffers, Titrations)",
    "Redox Chemistry (Oxidation States, Electrochemical Cells)",
    "Molecular Structure and Bonding (Lewis Structures, VSEPR)",
    "Organic Chemistry Reactions and Functional Groups",
    "Separation and Purification Methods (Chromatography, Distillation)",
    "Spectroscopy (NMR, IR, UV-Vis)",
  ],
  [MCATSection.BB]: [
    "Enzymes (Structure, Function, Kinetics, Regulation)",
    "Cellular Metabolism (Glycolysis, TCA, ETC, Gluconeogenesis, Fermentation)",
    "DNA Structure, Replication, and Repair Mechanisms",
    "RNA Transcription and Translation (Protein Synthesis)",
    "Gene Regulation (Operons, Transcription Factors)",
    "Proteins and Amino Acids (Structure, Properties, Functions)",
    "Lipids and Membranes (Structure, Function, Transport)",
    "Carbohydrates (Structure, Metabolism)",
    "Bioenergetics and Fuel Molecules",
    "Cell Biology (Organelles, Cell Cycle, Cytoskeleton)",
    "Endocrine System (Hormones, Glands, Regulation)",
    "Nervous System (Neurons, Action Potentials, Neurotransmitters)",
    "Musculoskeletal System (Muscle Contraction, Bone Structure)",
    "Circulatory, Respiratory, and Immune Systems",
    "Genetics and Mendelian Inheritance (Patterns, Linkage, Pedigrees)",
  ],
  [MCATSection.PS]: [
    "Sensation and Perception (Sensory Receptors, Processing)",
    "Attention and Consciousness (States of Consciousness)",
    "Memory (Encoding, Storage, Retrieval) and Learning (Classical/Operant Conditioning)",
    "Cognition, Problem Solving, and Language Development",
    "Motivation (Theories, Biological Bases) and Emotion (Theories, Expression)",
    "Stress (Sources, Physiological Response, Coping)",
    "Psychological Disorders (Anxiety, Mood, Schizophrenia, Personality)",
    "Social Behavior and Influence (Conformity, Obedience, Group Dynamics)",
    "Self-Identity and Social Interaction (Impression Management, Socialization)",
    "Social Structure and Demographics (Social Institutions, Culture)",
    "Social Stratification (Class, Status, Power, Mobility)",
    "Health and Healthcare Disparities",
    "Research Methods in Behavioral Sciences (Study Design, Ethics)",
  ],
};

export const LOCAL_STORAGE_PROGRESS_KEY = 'mcatPracticeWhizProgress';

// Original thresholds for a 20-question quiz
export const DEFAULT_RANK_THRESHOLDS_20_QUESTIONS: Array<[number, RankTier]> = [
  [19, RankTier.CHAMPION], 
  [17, RankTier.ELITE],    
  [15, RankTier.DIAMOND],  
  [13, RankTier.PLATINUM], 
  [11, RankTier.GOLD],     
  [9, RankTier.SILVER],    
  [0, RankTier.BRONZE],     
];

// Adjusted thresholds specifically for a 5-question quiz.
// These ranks (Platinum, Diamond) are not used in the 5Q version for simplicity.
export const RANK_THRESHOLDS_FOR_5_QUESTIONS: Array<[number, RankTier]> = [
  [5, RankTier.CHAMPION],  // 5/5
  [4, RankTier.ELITE],    // 4/5
  [3, RankTier.GOLD],     // 3/5
  [2, RankTier.SILVER],   // 2/5
  [0, RankTier.BRONZE],   // 0-1/5
];


export const RANK_NUMERICAL_VALUES: Record<RankTier, number> = {
  [RankTier.UNRANKED]: 0,
  [RankTier.BRONZE]: 1,
  [RankTier.SILVER]: 2,
  [RankTier.GOLD]: 3,
  [RankTier.PLATINUM]: 4,
  [RankTier.DIAMOND]: 5,
  [RankTier.ELITE]: 6,
  [RankTier.CHAMPION]: 7,
};

export const MIN_SUBTOPICS_FOR_OVERALL_RANK = 3;

export const RANK_ICON_MAP: Record<RankTier, string> = {
  [RankTier.UNRANKED]: "UnrankedIcon",
  [RankTier.BRONZE]: "BronzeIcon",
  [RankTier.SILVER]: "SilverIcon",
  [RankTier.GOLD]: "GoldIcon",
  [RankTier.PLATINUM]: "PlatinumIcon",
  [RankTier.DIAMOND]: "DiamondIcon",
  [RankTier.ELITE]: "EliteIcon",
  [RankTier.CHAMPION]: "ChampionIcon",
};