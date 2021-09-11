import { NextApiRequest, NextApiResponse } from "next";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {}

async function updateHandler(req: NextApiRequest, res: NextApiResponse) {
  // TODO get number of monitors belonging to user
  // TODO get allowed number of monitors for user and compare
}

async function createHandler(req: NextApiRequest, res: NextApiResponse) {}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {}
