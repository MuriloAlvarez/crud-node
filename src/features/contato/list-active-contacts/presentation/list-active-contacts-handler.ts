import { Request, Response } from "express";

import { ListActiveContactsUseCase } from "../application/list-active-contacts.use-case";
import { parseListActiveContactsRequest } from "./list-active-contacts-validator";
import { toContactResponse } from "./list-active-contacts-response";

export class ListActiveContactsHandler {
  public constructor(
    private readonly listActiveContactsUseCase: ListActiveContactsUseCase,
  ) {}

  public handle = async (req: Request, res: Response): Promise<void> => {
    parseListActiveContactsRequest(req.query);
    const contacts = await this.listActiveContactsUseCase.execute();
    res.status(200).json(contacts.map((contact) => toContactResponse(contact)));
  };
}
