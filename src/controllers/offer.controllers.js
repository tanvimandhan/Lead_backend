let offer = null;

export const createOffer = (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);
  
  if (!req.body) {
    return res.status(400).json({ error: "Request body is undefined. Make sure to send JSON with Content-Type: application/json" });
  }

  const { name, value_props, ideal_use_cases } = req.body;
  if (!name || !value_props || !ideal_use_cases)
    return res.status(400).json({ error: "Missing fields" });

  offer = { name, value_props, ideal_use_cases };
  res.status(201).json({ message: "Offer saved", offer });
};

export const getOffer = () => offer;
