import { Request, Response } from "express";

export const uknownEndpointLogger = (_: Request, res: Response) =>
  res.status(404).send({ error: "unknown endpoint" });
