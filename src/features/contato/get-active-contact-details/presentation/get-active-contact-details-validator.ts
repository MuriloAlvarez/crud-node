import { ContactValidationError } from "../domain/errors/contact-errors";

export function parseContactId(rawId: unknown): string {
  if (typeof rawId !== "string" || rawId.trim().length === 0) {
    throw new ContactValidationError("Id do contato invalido");
  }

  return rawId;
}
