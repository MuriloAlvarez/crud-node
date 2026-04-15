import { Request, Response } from "express";

import { DeactivateContactUseCase } from "../application/deactivate-contact.use-case";
import { parseContactId } from "./deactivate-contact-validator";
import { toContactResponse } from "./deactivate-contact-response";

export class DeactivateContactHandler {
  public constructor(
    private readonly deactivateContactUseCase: DeactivateContactUseCase,
  ) {}

  public handle = async (req: Request, res: Response): Promise<void> => {
    const id = parseContactId(req.params.id);
    const updatedContact = await this.deactivateContactUseCase.execute(id);

    res.status(200).json(toContactResponse(updatedContact));
  };
}
