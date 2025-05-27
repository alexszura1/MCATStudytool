
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MCATQuestion, MCATSection } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not found. Gemini features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const getPromptForSection = (section: MCATSection, subTopic?: string): string => {
  let categoryNameFull = "";
  let categoryShortCode = "";
  let exampleTopic1 = "";
  let exampleTopic2 = "";
  let specificInstructions = "";

  switch (section) {
    case MCATSection.CP:
      categoryNameFull = "Chemical and Physical Foundations of Biological Systems";
      categoryShortCode = "cp";
      exampleTopic1 = "Newtonian Mechanics";
      exampleTopic2 = "Acid-Base Chemistry";
      specificInstructions = "For C/P, this might be a physics problem, a chemistry question, data interpretation, or a short passage followed by a question related to these sciences.";
      break;
    case MCATSection.BB:
      categoryNameFull = "Biological and Biochemical Foundations of Living Systems";
      categoryShortCode = "bb";
      exampleTopic1 = "Glycolysis";
      exampleTopic2 = "DNA Replication";
      specificInstructions = "For B/B, this could involve biological pathways, molecular mechanisms, genetics, physiological processes, or a short passage followed by a question.";
      break;
    case MCATSection.PS:
      categoryNameFull = "Psychological, Social, and Biological Foundations of Behavior";
      categoryShortCode = "ps";
      exampleTopic1 = "Cognitive Dissonance";
      exampleTopic2 = "Classical Conditioning";
      specificInstructions = "For P/S, present a behavioral scenario, research finding, or a short passage followed by a question.";
      break;
    default:
      throw new Error("Invalid MCAT section provided for prompt generation.");
  }

  let subTopicFocusInstruction = "";
  let topicExample = exampleTopic1;

  if (subTopic && subTopic !== "General") {
    subTopicFocusInstruction = `
The question MUST focus specifically on the sub-topic: "${subTopic}". The scenarioText and options should clearly relate to this sub-topic within the broader ${categoryNameFull} domain.`;
    topicExample = subTopic;
  } else {
     subTopicFocusInstruction = `
The question can be about any relevant topic within ${categoryNameFull}.`;
  }


  return `You are an MCAT tutor specializing in ${categoryNameFull}. Generate a practice question.
Provide the output as a single JSON object with the following structure:
{
  "id": "${categoryShortCode}_scenario_[timestamp_or_random_string]",
  "topic": "Specific ${categoryNameFull} Topic (e.g., ${topicExample})",
  "category": "${section}", 
  "scenarioText": "A concise scenario, problem, or passage illustrating a key ${categoryNameFull} concept. This should be 2-5 sentences long. ${specificInstructions}",
  "options": ["Option A (Term/Concept/Solution)", "Option B", "Option C", "Option D (Correct Answer)"],
  "correctOption": "The text of the correct option from the options array",
  "explanation": "A detailed explanation (2-3 sentences) of why the correctOption is the right answer for the given scenarioText.",
  "distractorExplanations": {
    "Incorrect Option Text 1": "Explanation (1-2 sentences) why this specific option is incorrect in the context of the scenarioText.",
    "Incorrect Option Text 2": "Explanation...",
    "Incorrect Option Text 3": "Explanation..."
  }
}

Constraints:
- The "options" array must contain 3 or 4 terms/concepts/solutions. One must be the correctOption.
- The "correctOption" string must exactly match one of the strings in the "options" array.
- "distractorExplanations" must be an object. Its keys are the incorrect option strings, and its values are their explanations.
- VERY IMPORTANT: Each string key in the "distractorExplanations" object MUST BE AN EXACT, CHARACTER-FOR-CHARACTER MATCH with one of the incorrect option strings from the "options" array. Do not paraphrase or alter the option text when using it as a key.
- All text should be MCAT-relevant and at an appropriate difficulty level.
- Ensure the "id" is unique, for example, by using "${categoryShortCode}_scenario_" followed by a timestamp or random characters.
- The "category" field in the JSON must be one of "${MCATSection.CP}", "${MCATSection.BB}", or "${MCATSection.PS}".
${subTopicFocusInstruction}
- CRITICALLY IMPORTANT: The entire response MUST be ONLY the JSON object described above. Do NOT include any other text, explanations, or markdown formatting like \`\`\`json ... \`\`\` outside of the JSON object itself.

Example for ${categoryNameFull}${subTopic && subTopic !== "General" ? ` (focusing on ${subTopic})` : ''}:
{
  "id": "${categoryShortCode}_scenario_170000000_abc",
  "topic": "${topicExample}",
  "category": "${section}",
  "scenarioText": "Provide a relevant example scenario here for ${categoryNameFull}${subTopic && subTopic !== "General" ? ` related to ${subTopic}` : ''}.",
  "options": ["Example Option 1", "Example Correct Option", "Example Option 3", "Example Option 4"],
  "correctOption": "Example Correct Option",
  "explanation": "Explanation for why 'Example Correct Option' is correct.",
  "distractorExplanations": {
    "Example Option 1": "Explanation why Option 1 is incorrect.",
    "Example Option 3": "Explanation why Option 3 is incorrect.",
    "Example Option 4": "Explanation why Option 4 is incorrect."
  }
}
`;
};


export const fetchMCATQuestion = async (section: MCATSection, subTopic?: string): Promise<MCATQuestion | null> => {
  if (!ai) {
    console.warn("Gemini API key not configured. MCAT question feature disabled.");
    return null;
  }

  const prompt = getPromptForSection(section, subTopic);
  let geminiResponse: GenerateContentResponse | undefined = undefined;

  try {
    geminiResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8, 
        topK: 50,
        topP: 0.95,
      }
    });

    let jsonStr = geminiResponse.text.trim();
    
    console.log(`Raw response text from Gemini for section ${section}${subTopic ? ` (Sub-topic: ${subTopic})` : ''}:\n`, jsonStr);

    // Attempt to remove a specific known bad string if present
    const knownBadString = "분을 제외한 모든 문자는 금지됩니다.";
    if (jsonStr.includes(knownBadString)) {
      console.warn("Known bad string detected in Gemini response. Attempting removal:", knownBadString);
      jsonStr = jsonStr.replace(knownBadString, "").trim();
      console.log(`Response text after attempting to remove known bad string:\n`, jsonStr);
    }

    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
      console.log(`Response text after removing markdown fence for section ${section}${subTopic ? ` (Sub-topic: ${subTopic})` : ''}:\n`, jsonStr);
    }
    
    const parsedData = JSON.parse(jsonStr) as MCATQuestion;
    
    // Basic validation
    if (
        parsedData && 
        parsedData.id && 
        parsedData.topic && 
        parsedData.category === section &&
        parsedData.scenarioText &&
        parsedData.options && Array.isArray(parsedData.options) && parsedData.options.length >= 3 && parsedData.options.length <= 4 &&
        parsedData.correctOption && parsedData.options.includes(parsedData.correctOption) &&
        parsedData.explanation &&
        parsedData.distractorExplanations && typeof parsedData.distractorExplanations === 'object' &&
        Object.keys(parsedData.distractorExplanations).length === parsedData.options.length - 1 &&
        parsedData.options.filter(opt => opt !== parsedData.correctOption).every(opt => parsedData.distractorExplanations[opt])
    ) {
      return parsedData;
    }
    console.error(`Generated ${section}${subTopic ? ` (Sub-topic: ${subTopic})` : ''} question data is not in the expected format or failed validation. Raw data:`, parsedData, "Original string:", jsonStr);
    return null;
  } catch (error) {
    console.error(`Error fetching or parsing ${section}${subTopic ? ` (Sub-topic: ${subTopic})` : ''} question from Gemini. Raw response string was:\n'''\n${(geminiResponse && geminiResponse.text) ? geminiResponse.text : 'Response object not available or text property missing.'}\n'''\nError object:`, error);
    return null;
  }
};
