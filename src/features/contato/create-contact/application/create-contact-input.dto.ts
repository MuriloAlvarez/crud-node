import { ContactSex } from "../../shared/domain/entities/contact-sex";

export type CreateContactInput = {
  nome: string;
  dataNascimento: Date;
  sexo: ContactSex;
};
