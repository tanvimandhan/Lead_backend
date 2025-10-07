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
  results = await scoreLeads();
  res.status(200).json({ message: "Scoring completed", count: results.length });
});

router.get("/results", (req, res) => {
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

