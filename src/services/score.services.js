import { getOffer } from "../controllers/offer.controllers.js";
import { getLeads } from "../controllers/lead.controllers.js";
import { getAIIntent } from "./ai.service.js";

export const scoreLeads = async () => {
  const offer = getOffer();
  const leads = getLeads();
  const results = [];

  for (const lead of leads) {
    let ruleScore = 0;

    // 1️⃣ Role relevance
    const role = lead.role?.toLowerCase();
    if (role.includes("head") || role.includes("chief") || role.includes("director"))
      ruleScore += 20;
    else if (role.includes("manager") || role.includes("lead"))
      ruleScore += 10;

    // 2️⃣ Industry match
    const offerIndustry = offer.ideal_use_cases[0].toLowerCase();
    const leadIndustry = lead.industry?.toLowerCase();
    if (leadIndustry.includes(offerIndustry)) ruleScore += 20;
    else if (offerIndustry.includes(leadIndustry)) ruleScore += 10;

    // 3️⃣ Data completeness
    if (Object.values(lead).every((v) => v && v.trim() !== "")) ruleScore += 10;

    // AI layer
    const { intent, reasoning, aiScore } = await getAIIntent(lead, offer);

    const finalScore = ruleScore + aiScore;
    results.push({ ...lead, intent, score: finalScore, reasoning });
  }

  return results;
};
