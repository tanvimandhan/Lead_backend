let offer = null;

export const createOffer = (req, res) => {
  const { name, value_props, ideal_use_cases } = req.body;
  if (!name || !value_props || !ideal_use_cases)
    return res.status(400).json({ error: "Missing fields" });

  offer = { name, value_props, ideal_use_cases };
  res.status(201).json({ message: "Offer saved", offer });
};

export const getOffer = () => offer;
