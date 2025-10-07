import { getOffer } from "../controllers/offer.controllers.js";
import { getLeads } from "../controllers/lead.controllers.js";
import { getAIIntent } from "./ai.service.js";

export const scoreLeads = async () => {
  const offer = getOffer();
  const leads = getLeads();
  
  console.log("Offer:", offer);
  console.log("Leads:", leads);
  
  if (!offer) {
    throw new Error("No offer found. Please create an offer first.");
  }
  
  if (!leads || leads.length === 0) {
    throw new Error("No leads found. Please upload leads first.");
  }
  
  const results = [];

  for (const lead of leads) {
    let ruleScore = 0;

    // 1️⃣ Role relevance (max 20 points)
    const role = lead.role?.toLowerCase();
    if (role.includes("head") || role.includes("chief") || role.includes("director") || role.includes("vp") || role.includes("president"))
      ruleScore += 20; // Decision maker
    else if (role.includes("manager") || role.includes("lead") || role.includes("senior"))
      ruleScore += 10; // Influencer
    // else 0 points

    // 2️⃣ Industry match (max 20 points)
    const offerIndustry = offer.ideal_use_cases[0].toLowerCase();
    const leadIndustry = lead.industry?.toLowerCase();
    if (leadIndustry.includes(offerIndustry)) 
      ruleScore += 20; // Exact ICP match
    else if (offerIndustry.includes(leadIndustry) || leadIndustry.includes("saas") || leadIndustry.includes("tech"))
      ruleScore += 10; // Adjacent industry
    // else 0 points

    // 3️⃣ Data completeness (max 10 points)
    const requiredFields = ['name', 'role', 'company', 'industry', 'location', 'linkedin_bio'];
    const completeFields = requiredFields.filter(field => lead[field] && lead[field].trim() !== "");
    if (completeFields.length === requiredFields.length) 
      ruleScore += 10; // All fields present

    // AI layer (max 50 points)
    const { intent, reasoning, aiScore } = await getAIIntent(lead, offer);

    const finalScore = ruleScore + aiScore;
    const scoredLead = { ...lead, intent, score: finalScore, reasoning };
    console.log("Scored lead:", scoredLead);
    results.push(scoredLead);
  }

  console.log("Final results array:", results);
  console.log("Final results length:", results.length);
  return results;
};
