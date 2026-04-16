import { Contact } from "../../shared/domain/entities/contact";
import { ContactSex } from "../../shared/domain/entities/contact-sex";

export type ContactResponse = {
  id?: string;
  nome: string;
  dataNascimento: string;
  sexo: ContactSex;
  idade: number;
  ativo: boolean;
};

export function toContactResponse(contact: Contact): ContactResponse {
  return {
    id: contact.id,
    nome: contact.nome,
    dataNascimento: contact.dataNascimento.toISOString(),
    sexo: contact.sexo,
    idade: contact.idade,
    ativo: contact.ativo,
  };
}
