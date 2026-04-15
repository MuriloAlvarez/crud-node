import express from "express";

import { createContactRouter } from "./features/contato";
import { errorHandler } from "./shared/http/error-handler";

export function createApp(): express.Express {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/contatos", createContactRouter());
  app.use(errorHandler);

  return app;
}
