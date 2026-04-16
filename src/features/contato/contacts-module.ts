import { Router } from "express";

import { createContactController } from "./controllers/contact.controller";

export function createContactRouter(): Router {
  return createContactController();
}
