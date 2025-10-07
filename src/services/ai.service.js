export const getAIIntent = async (lead, offer) => {
  // Enhanced AI reasoning logic
  const leadText = `${lead.role} at ${lead.company} in ${lead.industry}`;
  const offerContext = offer.ideal_use_cases[0];
  
  let intent = "Medium";
  let aiScore = 30;
  let reasoning = "Moderate alignment with offer.";

  // High intent indicators
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
  // Low intent indicators
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
  // Medium intent (default)
  else {
    intent = "Medium";
    aiScore = 30;
    reasoning = `Moderate alignment - ${lead.role} role may have some influence in ${lead.industry}.`;
  }

  return { intent, aiScore, reasoning };
};
