import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAIIntent = async (lead, offer) => {
  try {
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log("Gemini API key not found, using mock AI logic");
      return getMockAIIntent(lead, offer);
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare the prompt for AI analysis
    const prompt = `
Analyze this lead for sales intent and fit with the offer:

LEAD INFORMATION:
- Name: ${lead.name}
- Role: ${lead.role}
- Company: ${lead.company}
- Industry: ${lead.industry}
- Location: ${lead.location || 'Not specified'}
- LinkedIn Bio: ${lead.linkedin_bio || 'Not provided'}

OFFER DETAILS:
- Product: ${offer.name}
- Value Props: ${offer.value_props.join(', ')}
- Ideal Use Cases: ${offer.ideal_use_cases.join(', ')}

Please classify the lead's intent as High, Medium, or Low and provide a 1-2 sentence explanation.

Consider:
1. Decision-making authority (Head, VP, C-level = High; Manager = Medium; Individual contributor = Low)
2. Industry alignment with offer
3. Role relevance to the product
4. Company size and growth stage
5. Geographic location relevance

Respond in this exact JSON format:
{
  "intent": "High|Medium|Low",
  "reasoning": "Your 1-2 sentence explanation here"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const aiResult = JSON.parse(text);

    // Map intent to scores
    let aiScore;
    switch (aiResult.intent) {
      case "High":
        aiScore = 50;
        break;
      case "Medium":
        aiScore = 30;
        break;
      case "Low":
        aiScore = 10;
        break;
      default:
        aiScore = 30;
        aiResult.intent = "Medium";
    }

    console.log(`Gemini AI Analysis for ${lead.name}: ${aiResult.intent} intent, ${aiScore} points`);
    
    return {
      intent: aiResult.intent,
      aiScore,
      reasoning: aiResult.reasoning
    };

  } catch (error) {
    console.error("Gemini AI service error:", error);
    
    // Fallback to mock logic if AI fails
    console.log("Falling back to mock AI logic due to error");
    return getMockAIIntent(lead, offer);
  }
};

// Fallback mock function (keeps existing logic as backup)
const getMockAIIntent = (lead, offer) => {
  const leadText = `${lead.role} at ${lead.company} in ${lead.industry}`;
  
  let intent = "Medium";
  let aiScore = 30;
  let reasoning = "Moderate alignment with offer.";

  if (
    leadText.toLowerCase().includes("growth") || 
    leadText.toLowerCase().includes("sales") ||
    leadText.toLowerCase().includes("revenue") ||
    leadText.toLowerCase().includes("marketing") ||
    (lead.role?.toLowerCase().includes("head") && lead.industry?.toLowerCase().includes("saas"))
  ) {
    intent = "High";
    aiScore = 50;
    reasoning = "Strong alignment with offer - decision maker in target industry with growth/sales focus.";
  } 
  else if (
    leadText.toLowerCase().includes("intern") ||
    leadText.toLowerCase().includes("junior") ||
    leadText.toLowerCase().includes("assistant") ||
    lead.role?.toLowerCase().includes("intern")
  ) {
    intent = "Low";
    aiScore = 10;
    reasoning = "Junior role with limited decision-making power.";
  }
  else {
    intent = "Medium";
    aiScore = 30;
    reasoning = `Moderate alignment - ${lead.role} role may have some influence in ${lead.industry}.`;
  }

  return { intent, aiScore, reasoning };
};