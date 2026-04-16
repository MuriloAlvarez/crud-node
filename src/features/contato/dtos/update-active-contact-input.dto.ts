import { ContactSex } from "@contato/domain/entities/contact-sex";

export type UpdateActiveContactInput = {
  id: string;
  nome: string;
  dataNascimento: Date;
  sexo: ContactSex;
};
