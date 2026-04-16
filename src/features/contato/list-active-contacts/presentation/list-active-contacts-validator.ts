import { ContactValidationError } from "../../shared/domain/errors/contact-errors";

export function parseListActiveContactsRequest(rawQuery: unknown): void {
  if (!rawQuery || typeof rawQuery !== "object") {
    throw new ContactValidationError("Query da requisicao e invalida");
  }
}
