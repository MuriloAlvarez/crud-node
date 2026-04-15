import { Request, Response } from "express";

import { DeleteContactUseCase } from "../application/delete-contact.use-case";
import { parseContactId } from "./delete-contact-validator";
import { toDeleteContactResponse } from "./delete-contact-response";

export class DeleteContactHandler {
  public constructor(
    private readonly deleteContactUseCase: DeleteContactUseCase,
  ) {}

  public handle = async (req: Request, res: Response): Promise<void> => {
    const id = parseContactId(req.params.id);
    await this.deleteContactUseCase.execute(id);

    res.status(204).send(toDeleteContactResponse());
  };
}
