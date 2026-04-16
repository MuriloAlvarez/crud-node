import { ContactSex } from "@contato/domain/entities/contact-sex";

export type CreateContactInput = {
  nome: string;
  dataNascimento: Date;
  sexo: ContactSex;
};
