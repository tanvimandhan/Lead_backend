import { parseCSV } from "../utils/csvParser.js";

let leads = [];

export const uploadLeads = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    leads = await parseCSV(req.file.buffer);
    res.status(200).json({ message: "Leads uploaded", count: leads.length });
  } catch (error) {
    console.error("CSV parsing error:", error);
    res.status(400).json({ error: "Invalid CSV file format" });
  }
};

export const getLeads = () => leads;
