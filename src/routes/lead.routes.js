import express from "express";
import multer from "multer";
import { uploadLeads } from "../controllers/lead.controllers.js";
import { scoreLeads } from "../services/score.services.js";
import fs from "fs";

const router = express.Router();

// Use memory storage for serverless deployment
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let results = [];

router.post("/upload", upload.single("file"), uploadLeads);

router.post("/score", async (req, res) => {
  try {
    console.log("Starting scoring process...");
    const scoringResults = await scoreLeads();
    console.log("Scoring function returned:", scoringResults);
    console.log("Results length from function:", scoringResults.length);
    
    // Store results in the module variable
    results = scoringResults;
    console.log("Results stored in module variable, length:", results.length);
    
    res.status(200).json({ message: "Scoring completed", count: results.length });
  } catch (error) {
    console.error("Scoring error:", error);
    res.status(500).json({ error: "Scoring failed", details: error.message });
  }
});

router.get("/results", (req, res) => {
  console.log("Results API called, results array:", results);
  console.log("Results length:", results.length);
  res.status(200).json(results);
});

// Export results as CSV
router.get("/results/export", (req, res) => {
  if (results.length === 0) {
    return res.status(400).json({ error: "No results to export. Run scoring first." });
  }

  const csvData =
    "name,role,company,industry,location,linkedin_bio,score,intent,reasoning\n" +
    results.map(
      (r) =>
        `${r.name || ""},${r.role || ""},${r.company || ""},${r.industry || ""},${r.location || ""},${r.linkedin_bio || ""},${r.score},${r.intent},"${r.reasoning}"`
    ).join("\n");

  // For serverless deployment, return CSV data directly
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="results.csv"');
  res.send(csvData);
});

export default router;

