import { Request, Response } from "express";

import { ActivateContactUseCase } from "../application/activate-contact.use-case";
import { toContactResponse } from "./activate-contact-response";
import { parseContactId } from "./activate-contact-validator";

export class ActivateContactHandler {
  public constructor(
    private readonly activateContactUseCase: ActivateContactUseCase,
  ) {}

  public handle = async (req: Request, res: Response): Promise<void> => {
    const id = parseContactId(req.params.id);
    const updatedContact = await this.activateContactUseCase.execute(id);

    res.status(200).json(toContactResponse(updatedContact));
  };
}
