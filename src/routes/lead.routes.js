import express from "express";
import multer from "multer";
import { uploadLeads } from "../controllers/lead.controllers.js";
import { scoreLeads } from "../services/score.services.js";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

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

// Optional: export as CSV
router.get("/results/export", (req, res) => {
  const csvData =
    "name,role,company,industry,score,intent,reasoning\n" +
    results.map(
      (r) =>
        `${r.name},${r.role},${r.company},${r.industry},${r.score},${r.intent},"${r.reasoning}"`
    ).join("\n");

  fs.writeFileSync("results.csv", csvData);
  res.download("results.csv");
});

export default router;

