import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req);
  res.redirect(
    `/dashboard/team/thankyou?teamId=${req.query.teamId}&orderId=${req.query.orderId}`,
  );
}
