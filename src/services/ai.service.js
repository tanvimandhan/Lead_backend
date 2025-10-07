export const getAIIntent = async (lead, offer) => {
  // Mock AI reasoning for demo
  const text = `${lead.role} at ${lead.company} in ${lead.industry}`;

  let intent = "Medium";
  let aiScore = 30;
  let reasoning = "Moderate alignment with offer.";

  if (text.toLowerCase().includes("growth") || text.toLowerCase().includes("sales")) {
    intent = "High";
    aiScore = 50;
    reasoning = "Strong alignment with outreach and SaaS context.";
  } else if (text.toLowerCase().includes("intern")) {
    intent = "Low";
    aiScore = 10;
    reasoning = "Junior role, low decision-making power.";
  }

  return { intent, aiScore, reasoning };
};
