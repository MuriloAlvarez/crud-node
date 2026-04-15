import { Request, Response } from "express";

import { GetActiveContactDetailsUseCase } from "../application/get-active-contact-details.use-case";
import { parseContactId } from "./get-active-contact-details-validator";
import { toContactResponse } from "./get-active-contact-details-response";

export class GetActiveContactDetailsHandler {
  public constructor(
    private readonly getActiveContactDetailsUseCase: GetActiveContactDetailsUseCase,
  ) {}

  public handle = async (req: Request, res: Response): Promise<void> => {
    const id = parseContactId(req.params.id);
    const contact = await this.getActiveContactDetailsUseCase.execute(id);

    res.status(200).json(toContactResponse(contact));
  };
}
