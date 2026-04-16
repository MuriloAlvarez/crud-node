import { CreateContactInput } from "@contato/dtos/create-contact-input.dto";
import { CONTACT_SEX_VALUES, ContactSex } from "@contato/domain/entities/contact-sex";
import { ContactValidationError } from "@contato/domain/errors/contact-errors";

export function parseCreateContactBody(rawBody: unknown): CreateContactInput {
  if (!rawBody || typeof rawBody !== "object") {
    throw new ContactValidationError("Body da requisicao e invalido");
  }

  const body = rawBody as {
    nome?: unknown;
    dataNascimento?: unknown;
    sexo?: unknown;
  };

  if (typeof body.nome !== "string") {
    throw new ContactValidationError("Campo nome e obrigatorio");
  }

  if (typeof body.dataNascimento !== "string") {
    throw new ContactValidationError("Campo dataNascimento e obrigatorio");
  }

  const parsedDate = new Date(body.dataNascimento);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new ContactValidationError(
      "Campo dataNascimento deve ser uma data valida",
    );
  }

  if (typeof body.sexo !== "string") {
    throw new ContactValidationError("Campo sexo e obrigatorio");
  }

  if (!CONTACT_SEX_VALUES.includes(body.sexo as ContactSex)) {
    throw new ContactValidationError(
      "Campo sexo precisa ser MASCULINO, FEMININO ou OUTRO",
    );
  }

  return {
    nome: body.nome,
    dataNascimento: parsedDate,
    sexo: body.sexo as ContactSex,
  };
}