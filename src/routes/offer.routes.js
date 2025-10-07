import express from "express";
import { createOffer } from "../controllers/offer.controllers.js";
const router = express.Router();

// Add debugging middleware
router.use((req, res, next) => {
  console.log(`Offer route hit: ${req.method} ${req.path}`);
  console.log("Request headers:", req.headers);
  next();
});

router.post("/", createOffer);
router.post("/create", createOffer);

// Handle URLs with trailing newlines or whitespace
router.post(/^\/$/, createOffer);

export default router;
