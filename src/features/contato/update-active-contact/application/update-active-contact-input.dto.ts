import { ContactSex } from "../domain/entities/contact-sex";

export type UpdateActiveContactInput = {
  id: string;
  nome: string;
  dataNascimento: Date;
  sexo: ContactSex;
};
