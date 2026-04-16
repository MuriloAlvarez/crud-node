import { Router } from "express";

import { asyncHandler } from "../../../../shared/http/async-handler";
import { ContactModel } from "../../shared/infrastructure/mongoose/contact-model";
import { MongooseContactRepository } from "../../shared/infrastructure/mongoose/mongoose-contact-repository";
import { CreateContactUseCase } from "../application/create-contact.use-case";
import { CreateContactHandler } from "./create-contact-handler";

export function createCreateContactEndpoint(): Router {
  const router = Router();

  const repository = new MongooseContactRepository(ContactModel);
  const createContactUseCase = new CreateContactUseCase(repository);
  const handler = new CreateContactHandler(createContactUseCase);

  router.post("/", asyncHandler(handler.handle));

  return router;
}
