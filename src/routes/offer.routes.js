import express from "express";
import { createOffer } from "../controllers/offer.controllers.js";
const router = express.Router();

router.post("/", createOffer);

export default router;
