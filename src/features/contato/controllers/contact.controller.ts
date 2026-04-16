import { Request, Response, Router } from "express";

import { toContactResponse } from "@contato/dtos/contact-response.dto";
import { ContactModel } from "@contato/infrastructure/mongoose/contact-model";
import { MongooseContactRepository } from "@contato/infrastructure/mongoose/mongoose-contact-repository";
import { ActivateContactUseCase } from "@contato/use-cases/activate-contact.use-case";
import { CreateContactUseCase } from "@contato/use-cases/create-contact.use-case";
import { DeactivateContactUseCase } from "@contato/use-cases/deactivate-contact.use-case";
import { DeleteContactUseCase } from "@contato/use-cases/delete-contact.use-case";
import { GetActiveContactDetailsUseCase } from "@contato/use-cases/get-active-contact-details.use-case";
import { ListActiveContactsUseCase } from "@contato/use-cases/list-active-contacts.use-case";
import { UpdateActiveContactUseCase } from "@contato/use-cases/update-active-contact.use-case";
import { parseCreateContactBody } from "@contato/validations/create-contact.validation";
import { parseListActiveContactsRequest } from "@contato/validations/list-active-contacts.validation";
import { parseContactId } from "@contato/validations/parse-contact-id.validation";
import { parseUpdateActiveContactBody } from "@contato/validations/update-active-contact.validation";
import { asyncHandler } from "@shared/http/async-handler";

export function createContactController(): Router {
  const router = Router();

  const repository = new MongooseContactRepository(ContactModel);

  const createContactUseCase = new CreateContactUseCase(repository);
  const listActiveContactsUseCase = new ListActiveContactsUseCase(repository);
  const getActiveContactDetailsUseCase = new GetActiveContactDetailsUseCase(
    repository,
  );
  const updateActiveContactUseCase = new UpdateActiveContactUseCase(repository);
  const activateContactUseCase = new ActivateContactUseCase(repository);
  const deactivateContactUseCase = new DeactivateContactUseCase(repository);
  const deleteContactUseCase = new DeleteContactUseCase(repository);

  router.post(
    "/",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const input = parseCreateContactBody(req.body);
      const createdContact = await createContactUseCase.execute(input);
      res.status(201).json(toContactResponse(createdContact));
    }),
  );

  router.get(
    "/",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      parseListActiveContactsRequest(req.query);
      const contacts = await listActiveContactsUseCase.execute();
      res
        .status(200)
        .json(contacts.map((contact) => toContactResponse(contact)));
    }),
  );

  router.get(
    "/:id",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const id = parseContactId(req.params.id);
      const contact = await getActiveContactDetailsUseCase.execute(id);
      res.status(200).json(toContactResponse(contact));
    }),
  );

  router.put(
    "/:id",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const id = parseContactId(req.params.id);
      const body = parseUpdateActiveContactBody(req.body);

      const updatedContact = await updateActiveContactUseCase.execute({
        id,
        nome: body.nome,
        dataNascimento: body.dataNascimento,
        sexo: body.sexo,
      });

      res.status(200).json(toContactResponse(updatedContact));
    }),
  );

  router.patch(
    "/:id/ativar",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const id = parseContactId(req.params.id);
      const updatedContact = await activateContactUseCase.execute(id);
      res.status(200).json(toContactResponse(updatedContact));
    }),
  );

  router.patch(
    "/:id/desativar",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const id = parseContactId(req.params.id);
      const updatedContact = await deactivateContactUseCase.execute(id);
      res.status(200).json(toContactResponse(updatedContact));
    }),
  );

  router.delete(
    "/:id",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const id = parseContactId(req.params.id);
      await deleteContactUseCase.execute(id);
      res.status(204).send();
    }),
  );

  return router;
}
