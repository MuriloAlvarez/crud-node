import { Request, Response } from "express";

import { CreateContactUseCase } from "../application/create-contact.use-case";
import { parseCreateContactBody } from "./create-contact-validator";
import { toContactResponse } from "./create-contact-response";

export class CreateContactHandler {
  public constructor(
    private readonly createContactUseCase: CreateContactUseCase,
  ) {}

  public handle = async (req: Request, res: Response): Promise<void> => {
    const input = parseCreateContactBody(req.body);
    const createdContact = await this.createContactUseCase.execute(input);

    res.status(201).json(toContactResponse(createdContact));
  };
}
