import { NextApiRequest, NextApiResponse } from "next";
import { MarketService } from "../../../util/MarketService";
import { getUserFromRequest } from "../../../util/authorization";
import get from "./get";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.candidateId || !req.body.amount || !req.body.expectedPrice) {
    res.status(400).json({ errorMessage: "Bitte füllen Sie alle Felder aus!" });
  }
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ errorMessage: "Bitte melden Sie sich an!" });
  }
  MarketService.trade(
    user._id.toString(),
    req.body.candidateId,
    req.body.amount,
    req.body.expectedPrice
  )
    .then(() => {
      get(req, res);
    })
    .catch(({ message }) => {
      res.status(500).json({ errorMessage: message });
    });
};
