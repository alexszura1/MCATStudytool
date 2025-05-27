


import React, { useState, useEffect, useCallback } from 'react';
import { MCATQuestion, MCATSection, GameStatus, RankTier, UserProgress, SectionProgress, SubTopicProgress } from './types';
import { 
    QUESTIONS_PER_SESSION, 
    MCAT_SUBTOPICS, 
    SECTION_ICONS_MAP,
    LOCAL_STORAGE_PROGRESS_KEY,
    RANK_THRESHOLDS_FOR_5_QUESTIONS, // Specifically use this for 5Q quizzes
    DEFAULT_RANK_THRESHOLDS_20_QUESTIONS, // For potential future use
    RANK_NUMERICAL_VALUES,
    MIN_SUBTOPICS_FOR_OVERALL_RANK,
    RANK_ICON_MAP
} from './constants';
import { fetchMCATQuestion } from './services/geminiService';
import { 
    AtomIcon, DnaIcon, BrainIcon, PlayIcon, ArrowRightIcon, CheckCircleIcon, BetterXCircleIcon, RefreshCwIcon, HomeIcon,
    UnrankedIcon, BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon, DiamondIcon, EliteIcon, ChampionIcon, RANK_ICONS,
    InformationCircleIcon
} from './components/icons';


const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NOT_STARTED);
  const [currentSection, setCurrentSection] = useState<MCATSection | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);
  const [currentMCATQuestion, setCurrentMCATQuestion] = useState<MCATQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [showRankInfoModal, setShowRankInfoModal] = useState(false);

  const totalQuestionsInGame = QUESTIONS_PER_SESSION; // Currently 5

  const getInitialUserProgress = (): UserProgress => {
    const progress: UserProgress = { 
      sections: {},
      overallRank: RankTier.UNRANKED 
    };
    Object.values(MCATSection).forEach(section => {
      progress.sections[section] = {};
      MCAT_SUBTOPICS[section].forEach(subTopic => {
        progress.sections[section][subTopic] = { bestScore: null, rank: RankTier.UNRANKED, quizzesTaken: 0 };
      });
      progress.sections[section]["General"] = { bestScore: null, rank: RankTier.UNRANKED, quizzesTaken: 0 };
    });
    return progress;
  };

  const loadProgress = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress) as UserProgress;
        // Basic validation and migration for 'bestScore'
        if (parsedProgress && typeof parsedProgress.sections === 'object' && parsedProgress.overallRank) {
          const initialProgress = getInitialUserProgress();
          Object.values(MCATSection).forEach(section => {
            if (!parsedProgress.sections[section]) {
              parsedProgress.sections[section] = initialProgress.sections[section];
            } else {
              MCAT_SUBTOPICS[section].forEach(subTopic => {
                const currentSubTopicData = parsedProgress.sections[section][subTopic];
                if (!currentSubTopicData) {
                  parsedProgress.sections[section][subTopic] = initialProgress.sections[section][subTopic];
                } else {
                  // Ensure bestScore field exists, migrate from 'score' if necessary (though current types expect bestScore)
                  if (typeof (currentSubTopicData as any).score !== 'undefined' && typeof currentSubTopicData.bestScore === 'undefined') {
                    currentSubTopicData.bestScore = (currentSubTopicData as any).score;
                    delete (currentSubTopicData as any).score;
                  }
                  if (typeof currentSubTopicData.bestScore === 'undefined') currentSubTopicData.bestScore = null;
                  if (typeof currentSubTopicData.rank === 'undefined') currentSubTopicData.rank = RankTier.UNRANKED;
                  if (typeof currentSubTopicData.quizzesTaken === 'undefined') currentSubTopicData.quizzesTaken = 0;

                }
              });
              // Same for "General"
              const generalData = parsedProgress.sections[section]["General"];
              if (!generalData) {
                  parsedProgress.sections[section]["General"] = initialProgress.sections[section]["General"];
              } else {
                  if (typeof (generalData as any).score !== 'undefined' && typeof generalData.bestScore === 'undefined') {
                    generalData.bestScore = (generalData as any).score;
                    delete (generalData as any).score;
                  }
                  if (typeof generalData.bestScore === 'undefined') generalData.bestScore = null;
                  if (typeof generalData.rank === 'undefined') generalData.rank = RankTier.UNRANKED;
                  if (typeof generalData.quizzesTaken === 'undefined') generalData.quizzesTaken = 0;
              }
            }
          });
          setUserProgress(parsedProgress);
        } else {
          setUserProgress(getInitialUserProgress());
        }
      } else {
        setUserProgress(getInitialUserProgress());
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage:", error);
      setUserProgress(getInitialUserProgress());
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const saveProgress = (progress: UserProgress) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(progress));
      setUserProgress(progress); 
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  };
  
  const calculateSubTopicRankFromScore = (score: number | null): RankTier => {
    if (score === null) return RankTier.UNRANKED;

    const thresholdsToUse = totalQuestionsInGame === 5 ? RANK_THRESHOLDS_FOR_5_QUESTIONS : DEFAULT_RANK_THRESHOLDS_20_QUESTIONS;
    
    for (const [threshold, rank] of thresholdsToUse) {
      if (score >= threshold) {
        return rank;
      }
    }
    // This fallback should ideally not be reached if thresholds include 0.
    // If score is 0, and RANK_THRESHOLDS_FOR_5_QUESTIONS includes [0, RankTier.BRONZE], Bronze will be returned.
    return RankTier.BRONZE; 
  };

  const calculateOverallRank = (currentProgress: UserProgress): RankTier => {
    let totalRankValue = 0;
    let rankedSubTopicsCount = 0;

    Object.values(MCATSection).forEach(sectionKey => {
        const sectionEnumVal = sectionKey as MCATSection;
        const sectionData = currentProgress.sections[sectionEnumVal]; 
        
        if (sectionData) {
            // Exclude "General" from overall rank calculation for now, or decide how to include it
            Object.keys(sectionData).filter(key => key !== "General").forEach(subTopicKey => {
                const subTopicProg = sectionData[subTopicKey];
                if (subTopicProg && subTopicProg.rank && subTopicProg.quizzesTaken !== undefined) {
                    if (subTopicProg.rank !== RankTier.UNRANKED && subTopicProg.quizzesTaken > 0) {
                        totalRankValue += RANK_NUMERICAL_VALUES[subTopicProg.rank];
                        rankedSubTopicsCount++;
                    }
                }
            });
        }
    });

    if (rankedSubTopicsCount < MIN_SUBTOPICS_FOR_OVERALL_RANK) {
      return RankTier.UNRANKED;
    }

    const averageRankValue = Math.round(totalRankValue / rankedSubTopicsCount);
    
    const sortedRankTiersByValue = (Object.entries(RANK_NUMERICAL_VALUES) as [RankTier, number][])
      .sort(([, valA], [, valB]) => valB - valA);
    
    for (const [rank, numericalValue] of sortedRankTiersByValue) {
      if (averageRankValue >= numericalValue && rank !== RankTier.UNRANKED) {
        return rank;
      }
    }
    if (averageRankValue > 0) return RankTier.BRONZE; 
    return RankTier.UNRANKED;
  };


  const resetGameState = (resetSectionAndSubtopic = true) => {
    setCurrentMCATQuestion(null);
    setSelectedOption(null);
    setQuestionsAnswered(0);
    setFeedbackMessage(null);
    setIsAnswerRevealed(false);
    setSessionScore(0); 
    if (resetSectionAndSubtopic) {
      setCurrentSection(null);
      setSelectedSubTopic(null);
    }
  };

  const generateMCATQuestion = useCallback(async (section: MCATSection, subTopic?: string) => {
    if (!process.env.API_KEY) {
        setFeedbackMessage("API Key not configured. This feature is disabled.");
        setGameStatus(GameStatus.NOT_STARTED);
        return;
    }
    setGameStatus(GameStatus.LOADING_CONTENT);
    setSelectedOption(null);
    setFeedbackMessage(null);
    setIsAnswerRevealed(false);

    const questionData = await fetchMCATQuestion(section, subTopic);
    
    if (questionData) {
      setCurrentMCATQuestion(questionData);
      setGameStatus(GameStatus.PLAYING);
    } else {
      setFeedbackMessage(`Failed to load content for ${section}${subTopic ? ` (${subTopic})` : ''}. The API might have returned an unexpected response or there was a parsing error. Please check console logs, try again, or check API key.`);
      setGameStatus(GameStatus.NOT_STARTED); 
    }
  }, []);
  
  const handleSelectSection = (section: MCATSection) => {
    resetGameState(false); 
    setCurrentSection(section);
    setSelectedSubTopic(null); 
    setGameStatus(GameStatus.SELECTING_SUBTOPIC);
  };

  const handleSelectSubTopic = (subTopic: string) => {
    setSelectedSubTopic(subTopic);
    if (currentSection) {
      setQuestionsAnswered(0); 
      setSessionScore(0); 
      generateMCATQuestion(currentSection, subTopic);
    }
  };
  
  const handleSelectOption = (option: string) => { 
    if (gameStatus === GameStatus.SHOWING_ANSWER || !currentMCATQuestion) return;

    setSelectedOption(option);
    setIsAnswerRevealed(true);
    setGameStatus(GameStatus.SHOWING_ANSWER);

    if (option === currentMCATQuestion.correctOption) {
      setFeedbackMessage("Correct!");
      setSessionScore(prevScore => prevScore + 1); 
    } else {
      setFeedbackMessage(`Incorrect. The correct answer is: ${currentMCATQuestion.correctOption}`);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestionNum = questionsAnswered + 1;
    if (nextQuestionNum >= totalQuestionsInGame) {
      setGameStatus(GameStatus.GAME_OVER);
      if (currentSection && selectedSubTopic && userProgress) {
        const updatedProgress = JSON.parse(JSON.stringify(userProgress)) as UserProgress; 

        if (selectedSubTopic !== "General") { // "General" quizzes don't update specific sub-topic ranks
          const previousSubTopicData = userProgress.sections[currentSection]?.[selectedSubTopic] || { bestScore: null, rank: RankTier.UNRANKED, quizzesTaken: 0 };
          
          let newBestScore = previousSubTopicData.bestScore || 0;
          if (sessionScore > newBestScore) {
            newBestScore = sessionScore;
          }
          
          updatedProgress.sections[currentSection][selectedSubTopic] = {
            bestScore: newBestScore, 
            rank: calculateSubTopicRankFromScore(newBestScore),
            quizzesTaken: (previousSubTopicData.quizzesTaken || 0) + 1
          };
        }
        updatedProgress.overallRank = calculateOverallRank(updatedProgress);
        saveProgress(updatedProgress);
      }
    } else {
      setQuestionsAnswered(nextQuestionNum);
      if (currentSection && selectedSubTopic) { 
        generateMCATQuestion(currentSection, selectedSubTopic); 
      } else {
        setGameStatus(GameStatus.NOT_STARTED); // Should not happen if game is ongoing
      }
    }
  };

  const handleGoHome = () => {
    setGameStatus(GameStatus.NOT_STARTED);
    resetGameState(true);
  };
  
  const getRankIconComponent = (rankTier: RankTier | undefined, desiredClassName?: string): JSX.Element | null => {
    const effectiveRank = rankTier || RankTier.UNRANKED;
    const iconKey = RANK_ICON_MAP[effectiveRank];
    const defaultClassName = "w-5 h-5 inline-block ml-1";

    const getUnrankedIcon = (classNameToUse: string) => {
        const unrankedKey = RANK_ICON_MAP[RankTier.UNRANKED];
        const UnrankedComponent = RANK_ICONS[unrankedKey];
        return UnrankedComponent ? <UnrankedComponent className={classNameToUse} /> : null;
    }

    if (!iconKey) {
      console.warn(`Icon key not found for rank: ${effectiveRank}. Defaulting to Unranked.`);
      return getUnrankedIcon(desiredClassName || defaultClassName);
    }

    const IconComponent = RANK_ICONS[iconKey];

    if (!IconComponent) {
      console.warn(`Icon component not found for key: ${iconKey} (rank: ${effectiveRank}). Defaulting to Unranked.`);
      return getUnrankedIcon(desiredClassName || defaultClassName);
    }

    return <IconComponent className={desiredClassName || defaultClassName} />;
  };
  
  const toggleRankInfoModal = () => {
    setShowRankInfoModal(!showRankInfoModal);
  };

  const renderHeader = (title: string, subTitle?: string) => (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-cyan-400">{title}</h1>
        {subTitle && <h2 className="text-sm md:text-md text-sky-300 -mt-1">{subTitle}</h2>}
      </div>
      {(gameStatus !== GameStatus.NOT_STARTED) && (
         <button onClick={handleGoHome} className="p-2 text-slate-400 hover:text-sky-400 transition-colors" aria-label="Go Home">
            <HomeIcon className="w-6 h-6" />
          </button>
      )}
    </div>
  );

  if (showRankInfoModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full text-slate-100">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">How Ranks Work</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-sky-300 mb-1">Overall Rank</h3>
            <p className="text-sm text-slate-300">
              Your Overall Rank is an average of all your ranked Sub-topic performances. 
              You need to complete quizzes in at least <strong>{MIN_SUBTOPICS_FOR_OVERALL_RANK} different sub-topics</strong> (with at least 1 quiz taken in each) to unlock it.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-sky-300 mb-2">Sub-topic Ranks (Score out of {totalQuestionsInGame})</h3>
            <ul className="space-y-1 text-sm">
              {[...RANK_THRESHOLDS_FOR_5_QUESTIONS].reverse().map(([threshold, rank], index, arr) => {
                let lowerBound = 0;
                // Find the next rank's threshold + 1 to define the lower bound of the current rank's score range
                if (index < arr.length - 1) { 
                    lowerBound = arr[index + 1][0] + 1;
                }
                 if (rank === RankTier.BRONZE) lowerBound = 0; // Bronze always starts at 0

                const IconElement = getRankIconComponent(rank, "w-5 h-5 mr-3");
                let scoreRange = "";
                // Special case for Champion if it's a perfect score
                if (rank === RankTier.CHAMPION && threshold === totalQuestionsInGame) {
                    scoreRange = `${totalQuestionsInGame}/${totalQuestionsInGame}`;
                } else if (threshold === lowerBound) { // If upper and lower bounds are the same (single score for a rank)
                    scoreRange = `${threshold}/${totalQuestionsInGame}`;
                } else {
                    scoreRange = `${lowerBound}-${threshold}/${totalQuestionsInGame}`;
                }
                // Ensure Bronze doesn't show a negative lower bound or miscalculated range if it's the only one starting at 0
                if (rank === RankTier.BRONZE && lowerBound > threshold) {
                    scoreRange = `0-${threshold}/${totalQuestionsInGame}`;
                }


                return (
                  <li key={rank} className="flex items-center p-2 bg-slate-700 rounded">
                    {IconElement}
                    <span className="font-semibold text-yellow-400 min-w-[100px]">{rank}:</span>
                    <span className="text-slate-300">{scoreRange}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            onClick={toggleRankInfoModal}
            className="mt-6 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }


  if (gameStatus === GameStatus.LOADING_CONTENT) {
    return (
      <div className="text-center max-w-lg mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl">
        {renderHeader(currentSection ? `Loading ${currentSection}...` : "Loading...", selectedSubTopic && selectedSubTopic !== "General" ? selectedSubTopic : undefined)}
        <div className="flex flex-col items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-sky-400"></div>
          <p className="mt-4 text-lg text-slate-300">Loading content from Gemini...</p>
        </div>
      </div>
    );
  }
  
  if (gameStatus === GameStatus.NOT_STARTED) {
    const sectionButtons = [
      { section: MCATSection.CP, label: "Chem/Phys (C/P)", Icon: AtomIcon, color: "bg-sky-500 hover:bg-sky-600" },
      { section: MCATSection.BB, label: "Bio/Biochem (B/B)", Icon: DnaIcon, color: "bg-emerald-500 hover:bg-emerald-600" },
      { section: MCATSection.PS, label: "Psych/Soc (P/S)", Icon: BrainIcon, color: "bg-indigo-500 hover:bg-indigo-600" },
    ];
    
    const overallRank = userProgress?.overallRank || RankTier.UNRANKED;
    const overallRankIcon = getRankIconComponent(overallRank);

    return (
      <div className="text-center max-w-lg mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-2 text-cyan-400">MCAT Practice Whiz</h1>
        <div className="mb-6 text-lg text-slate-300 flex items-center justify-center">
            Overall Rank: <span className="font-semibold text-yellow-400 ml-1 mr-1">{overallRank}</span>
            {overallRank !== RankTier.UNRANKED && overallRankIcon}
            <button onClick={toggleRankInfoModal} className="ml-2 text-slate-400 hover:text-sky-300" aria-label="Rank Information">
                <InformationCircleIcon className="w-5 h-5" />
            </button>
        </div>
         {overallRank === RankTier.UNRANKED && <p className="text-xs text-slate-400 mb-6 -mt-4">(Complete quizzes in {MIN_SUBTOPICS_FOR_OVERALL_RANK} different sub-topics to unlock)</p>}
        
        <p className="text-md text-slate-300 mb-8">Choose a section to practice with AI-generated questions and detailed explanations.</p>
        {feedbackMessage && (
             <p className="text-amber-400 bg-amber-900/50 p-3 rounded-md mb-6 border border-amber-700 text-sm">{feedbackMessage}</p>
        )}
        <div className="space-y-4">
            {sectionButtons.map(({ section, label, Icon, color }) => (
                 <button 
                    key={section}
                    onClick={() => handleSelectSection(section)}
                    disabled={!process.env.API_KEY}
                    className={`w-full text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${color}`}
                >
                    <Icon className="w-6 h-6 mr-3" />
                    {label}
                </button>
            ))}
            {!process.env.API_KEY && <p className="text-xs text-amber-500 text-center mt-2">API_KEY not set. Practice sections disabled.</p>}
        </div>
      </div>
    );
  }

  if (gameStatus === GameStatus.SELECTING_SUBTOPIC && currentSection && userProgress) {
    const subTopicsForSection = MCAT_SUBTOPICS[currentSection] || [];
    const sectionProgress = userProgress.sections[currentSection] || {};
    
    return (
      <div className="max-w-xl w-full mx-auto p-6 bg-slate-800 rounded-xl shadow-2xl">
        {renderHeader(`Select Sub-topic for ${currentSection}`)}
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          <button
            onClick={() => handleSelectSubTopic("General")}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition-transform transform hover:scale-102 flex items-center justify-between shadow-md text-sm md:text-base"
          >
            <span>
                <PlayIcon className="w-5 h-5 mr-2 inline-block" />
                General {currentSection} Practice
            </span>
            {/* Rank for "General" could be shown here from sectionProgress["General"]?.rank */}
            {getRankIconComponent(sectionProgress["General"]?.rank)}
          </button>
          {subTopicsForSection.map((subTopic) => {
            // Ensure subTopicData is correctly initialized if not present, using bestScore
            const subTopicData = sectionProgress[subTopic] || { bestScore: null, rank: RankTier.UNRANKED, quizzesTaken: 0 };
            const RankIconElement = getRankIconComponent(subTopicData.rank);
            return (
                <button
                key={subTopic}
                onClick={() => handleSelectSubTopic(subTopic)}
                className="w-full bg-slate-600 hover:bg-slate-700 text-slate-100 font-medium py-3 px-4 rounded-lg transition-transform transform hover:scale-102 flex items-center justify-between text-left shadow-md text-sm md:text-base"
                >
                <span className="mr-2">{subTopic}</span>
                {RankIconElement}
                </button>
            );
          })}
        </div>
      </div>
    );
  }
  
  if (gameStatus === GameStatus.GAME_OVER) {
    const subTopicRankAchieved = (currentSection && selectedSubTopic && selectedSubTopic !== "General" && userProgress && userProgress.sections[currentSection]?.[selectedSubTopic]) 
                                  ? userProgress.sections[currentSection]?.[selectedSubTopic]?.rank 
                                  : null;
    const subTopicRankIcon = getRankIconComponent(subTopicRankAchieved);
    const overallRank = userProgress?.overallRank || RankTier.UNRANKED;
    const overallRankIcon = getRankIconComponent(overallRank);


    return (
      <div className="text-center max-w-lg mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl">
        {renderHeader(
          `${currentSection || "Practice"} Session Complete!`,
          selectedSubTopic && selectedSubTopic !== "General" ? selectedSubTopic : undefined
        )}
        <p className="text-2xl text-slate-100 mb-2">Your Score: <span className="font-bold text-sky-400">{sessionScore} / {totalQuestionsInGame}</span></p>
        
        {selectedSubTopic && selectedSubTopic !== "General" && subTopicRankAchieved && (
            <p className="text-lg text-slate-300 mb-2">
                Sub-topic Rank ({selectedSubTopic}): <span className="font-semibold text-yellow-300">{subTopicRankAchieved}</span>
                {subTopicRankIcon}
            </p>
        )}
        <p className="text-lg text-slate-300 mb-8">
            Overall Rank: <span className="font-semibold text-yellow-400">{overallRank}</span>
            {overallRankIcon}
        </p>

        <button 
          onClick={handleGoHome}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg"
        >
          <RefreshCwIcon className="w-6 h-6 mr-2" /> Back to Home
        </button>
      </div>
    );
  }

  if ((gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.SHOWING_ANSWER) && currentMCATQuestion && currentSection) {
    const { scenarioText, options, correctOption, explanation, distractorExplanations, topic } = currentMCATQuestion;

    return (
      <div className="max-w-2xl w-full mx-auto p-6 bg-slate-800 rounded-xl shadow-2xl space-y-5">
        {renderHeader(
            currentSection,
            selectedSubTopic && selectedSubTopic !== "General" ? selectedSubTopic : undefined
        )}
        <div className="flex justify-between items-baseline text-sm text-slate-400 -mt-4 mb-2">
            <span className="font-semibold text-purple-300">Topic: {topic}</span>
            <span>Question: <span className="text-sky-400">{questionsAnswered + 1}/{totalQuestionsInGame}</span></span>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg shadow">
          <p className="text-md md:text-lg text-slate-100 whitespace-pre-wrap">{scenarioText}</p>
        </div>

        {!isAnswerRevealed && gameStatus === GameStatus.PLAYING && (
          <div className="grid grid-cols-1 gap-3 mt-3">
            {options.map((optionText, index) => (
              <button 
                key={index}
                onClick={() => handleSelectOption(optionText)}
                aria-label={`Answer: ${optionText}`}
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 shadow-md text-sm md:text-base"
              >
                {optionText}
              </button>
            ))}
          </div>
        )}
        
        {isAnswerRevealed && gameStatus === GameStatus.SHOWING_ANSWER && (
          <div className="mt-4 space-y-4 p-4 bg-slate-750 rounded-lg shadow-inner">
            {feedbackMessage && (
              <div className={`p-3 rounded-md text-center font-semibold
                ${selectedOption === correctOption ? 'bg-green-700 border-green-500 text-green-100' : 'bg-red-700 border-red-500 text-red-100'} border-2 shadow-md`}>
                <div className="flex items-center justify-center">
                  {selectedOption === correctOption ? 
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-300" /> : 
                    <BetterXCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-300" />
                  }
                  <span className="text-sm md:text-base">{feedbackMessage}</span>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-md font-semibold text-amber-400 mb-1">Explanation (Correct Answer: {correctOption}):</h4>
              <p className="text-sm text-slate-200 whitespace-pre-wrap">{explanation}</p>
            </div>

            {Object.entries(distractorExplanations).map(([distractor, distractorExpl]) => (
              <div key={distractor}>
                <h4 className="text-md font-semibold text-rose-400 mb-1">Why "{distractor}" is incorrect:</h4>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{distractorExpl}</p>
              </div>
            ))}
            
            <button 
              onClick={handleNextQuestion}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center text-lg mt-3"
            >
              {questionsAnswered + 1 >= totalQuestionsInGame ? 'Finish Session' : 'Next Question'}
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return <div className="text-center text-xl p-8 bg-slate-800 rounded-xl shadow-2xl">Initializing or an unexpected state occurred. <button onClick={handleGoHome} className="text-sky-400 hover:text-sky-300">Go Home</button></div>;
};

export default App;