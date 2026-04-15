import { Router } from "express";

import { asyncHandler } from "../../../../shared/http/async-handler";
import { ContactModel } from "../infrastructure/mongoose/contact-model";
import { MongooseContactRepository } from "../infrastructure/mongoose/mongoose-contact-repository";
import { DeactivateContactUseCase } from "../application/deactivate-contact.use-case";
import { DeactivateContactHandler } from "./deactivate-contact-handler";

export function createDeactivateContactEndpoint(): Router {
  const router = Router();

  const repository = new MongooseContactRepository(ContactModel);
  const deactivateContactUseCase = new DeactivateContactUseCase(repository);
  const handler = new DeactivateContactHandler(deactivateContactUseCase);

  router.patch("/:id/desativar", asyncHandler(handler.handle));

  return router;
}
