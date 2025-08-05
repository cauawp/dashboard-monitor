import { NextApiRequest, NextApiResponse } from "next";

const mockData = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  userId: `user_${i}`,
  type: i % 2 === 0 ? "login" : "purchase",
  value: Math.floor(Math.random() * 200),
  timestamp: new Date(Date.now() - i * 1000 * 60).toISOString(),
  metadata: {
    product: "Widget",
    campaign: "xpto",
  },
}));

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(mockData);
}
