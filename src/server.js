import express from "express";
import leadRoutes from "./routes/lead.routes.js";
import offerRoutes from "./routes/offer.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/leads", leadRoutes);
app.use("/api/offers", offerRoutes);
app.use("/offer", offerRoutes); // Direct path as per spec

// Root route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
