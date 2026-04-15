import { Router } from "express";

import { asyncHandler } from "../../../../shared/http/async-handler";
import { ContactModel } from "../infrastructure/mongoose/contact-model";
import { MongooseContactRepository } from "../infrastructure/mongoose/mongoose-contact-repository";
import { ListActiveContactsUseCase } from "../application/list-active-contacts.use-case";
import { ListActiveContactsHandler } from "./list-active-contacts-handler";

export function createListActiveContactsEndpoint(): Router {
  const router = Router();

  const repository = new MongooseContactRepository(ContactModel);
  const listActiveContactsUseCase = new ListActiveContactsUseCase(repository);
  const handler = new ListActiveContactsHandler(listActiveContactsUseCase);

  router.get("/", asyncHandler(handler.handle));

  return router;
}
