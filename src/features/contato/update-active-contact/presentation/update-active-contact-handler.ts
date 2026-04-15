import { Request, Response } from "express";

import { UpdateActiveContactUseCase } from "../application/update-active-contact.use-case";
import { toContactResponse } from "./update-active-contact-response";
import {
  parseContactId,
  parseUpdateActiveContactBody,
} from "./update-active-contact-validator";

export class UpdateActiveContactHandler {
  public constructor(
    private readonly updateActiveContactUseCase: UpdateActiveContactUseCase,
  ) {}

  public handle = async (req: Request, res: Response): Promise<void> => {
    const id = parseContactId(req.params.id);
    const body = parseUpdateActiveContactBody(req.body);

    const updatedContact = await this.updateActiveContactUseCase.execute({
      id,
      nome: body.nome,
      dataNascimento: body.dataNascimento,
      sexo: body.sexo,
    });

    res.status(200).json(toContactResponse(updatedContact));
  };
}
