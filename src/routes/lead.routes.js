import express from "express";
import multer from "multer";
import { uploadLeads } from "../controllers/lead.controllers";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("file"), uploadLeads);

export default router;
