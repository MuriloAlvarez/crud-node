import { Router } from "express";

import { asyncHandler } from "../../../../shared/http/async-handler";
import { ActivateContactUseCase } from "../application/activate-contact.use-case";
import { ContactModel } from "../infrastructure/mongoose/contact-model";
import { MongooseContactRepository } from "../infrastructure/mongoose/mongoose-contact-repository";
import { ActivateContactHandler } from "./activate-contact-handler";

export function createActivateContactEndpoint(): Router {
  const router = Router();

  const repository = new MongooseContactRepository(ContactModel);
  const activateContactUseCase = new ActivateContactUseCase(repository);
  const handler = new ActivateContactHandler(activateContactUseCase);

  router.patch("/:id/ativar", asyncHandler(handler.handle));

  return router;
}
