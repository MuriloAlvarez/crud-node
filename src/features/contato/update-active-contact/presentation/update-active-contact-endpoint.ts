import { Router } from "express";

import { asyncHandler } from "../../../../shared/http/async-handler";
import { UpdateActiveContactUseCase } from "../application/update-active-contact.use-case";
import { ContactModel } from "../infrastructure/mongoose/contact-model";
import { MongooseContactRepository } from "../infrastructure/mongoose/mongoose-contact-repository";
import { UpdateActiveContactHandler } from "./update-active-contact-handler";

export function createUpdateActiveContactEndpoint(): Router {
  const router = Router();

  const repository = new MongooseContactRepository(ContactModel);
  const updateActiveContactUseCase = new UpdateActiveContactUseCase(repository);
  const handler = new UpdateActiveContactHandler(updateActiveContactUseCase);

  router.put("/:id", asyncHandler(handler.handle));

  return router;
}
