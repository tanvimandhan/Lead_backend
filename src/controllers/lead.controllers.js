import { parseCSV } from "../utils/csvParser.js";

let leads = [];

export const uploadLeads = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  leads = await parseCSV(req.file.path);
  res.status(200).json({ message: "Leads uploaded", count: leads.length });
};

export const getLeads = () => leads;
