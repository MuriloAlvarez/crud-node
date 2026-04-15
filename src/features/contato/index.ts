import { Router } from "express";

import { createActivateContactEndpoint } from "./activate-contact/presentation/activate-contact-endpoint";
import { createCreateContactEndpoint } from "./create-contact/presentation/create-contact-endpoint";
import { createDeactivateContactEndpoint } from "./deactivate-contact/presentation/deactivate-contact-endpoint";
import { createDeleteContactEndpoint } from "./delete-contact/presentation/delete-contact-endpoint";
import { createGetActiveContactDetailsEndpoint } from "./get-active-contact-details/presentation/get-active-contact-details-endpoint";
import { createListActiveContactsEndpoint } from "./list-active-contacts/presentation/list-active-contacts-endpoint";
import { createUpdateActiveContactEndpoint } from "./update-active-contact/presentation/update-active-contact-endpoint";

export function createContactRouter(): Router {
  const router = Router();

  router.use(createCreateContactEndpoint());
  router.use(createListActiveContactsEndpoint());
  router.use(createGetActiveContactDetailsEndpoint());
  router.use(createUpdateActiveContactEndpoint());
  router.use(createActivateContactEndpoint());
  router.use(createDeactivateContactEndpoint());
  router.use(createDeleteContactEndpoint());

  return router;
}
