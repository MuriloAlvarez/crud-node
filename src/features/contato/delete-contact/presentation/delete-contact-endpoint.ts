import { Router } from "express";

import { asyncHandler } from "../../../../shared/http/async-handler";
import { ContactModel } from "../infrastructure/mongoose/contact-model";
import { MongooseContactRepository } from "../infrastructure/mongoose/mongoose-contact-repository";
import { DeleteContactUseCase } from "../application/delete-contact.use-case";
import { DeleteContactHandler } from "./delete-contact-handler";

export function createDeleteContactEndpoint(): Router {
  const router = Router();

  const repository = new MongooseContactRepository(ContactModel);
  const deleteContactUseCase = new DeleteContactUseCase(repository);
  const handler = new DeleteContactHandler(deleteContactUseCase);

  router.delete("/:id", asyncHandler(handler.handle));

  return router;
}
