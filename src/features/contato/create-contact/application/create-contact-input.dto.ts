import { ContactSex } from "../domain/entities/contact-sex";

export type CreateContactInput = {
  nome: string;
  dataNascimento: Date;
  sexo: ContactSex;
};
