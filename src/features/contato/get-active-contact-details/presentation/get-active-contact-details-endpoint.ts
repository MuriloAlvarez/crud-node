import { Router } from "express";

import { asyncHandler } from "../../../../shared/http/async-handler";
import { ContactModel } from "../../shared/infrastructure/mongoose/contact-model";
import { MongooseContactRepository } from "../../shared/infrastructure/mongoose/mongoose-contact-repository";
import { GetActiveContactDetailsUseCase } from "../application/get-active-contact-details.use-case";
import { GetActiveContactDetailsHandler } from "./get-active-contact-details-handler";

export function createGetActiveContactDetailsEndpoint(): Router {
  const router = Router();

  const repository = new MongooseContactRepository(ContactModel);
  const getActiveContactDetailsUseCase = new GetActiveContactDetailsUseCase(
    repository,
  );
  const handler = new GetActiveContactDetailsHandler(
    getActiveContactDetailsUseCase,
  );

  router.get("/:id", asyncHandler(handler.handle));

  return router;
}
