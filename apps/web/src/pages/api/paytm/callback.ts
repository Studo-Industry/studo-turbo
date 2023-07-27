import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log(req);
    res.redirect(
      `/dashboard/team/thankyou?teamId=${req.query.teamId}&orderId=${req.query.orderId}`,
    );
  } else {
    // Handle any other HTTP method
  }
}
