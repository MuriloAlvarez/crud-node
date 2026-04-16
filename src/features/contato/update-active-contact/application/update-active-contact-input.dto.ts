import { ContactSex } from "../../shared/domain/entities/contact-sex";

export type UpdateActiveContactInput = {
  id: string;
  nome: string;
  dataNascimento: Date;
  sexo: ContactSex;
};
