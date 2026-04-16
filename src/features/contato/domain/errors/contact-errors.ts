import { AppError } from "@shared/http/app-error";

export class ContactValidationError extends AppError {
  public constructor(message: string) {
    super(message, 400, "CONTACT_VALIDATION_ERROR");
  }
}

export class ContactNotFoundError extends AppError {
  public constructor() {
    super("Contato nao encontrado", 404, "CONTACT_NOT_FOUND");
  }
}

export class ContactInactiveError extends AppError {
  public constructor() {
    super("Contato inativo", 404, "CONTACT_INACTIVE");
  }
}
