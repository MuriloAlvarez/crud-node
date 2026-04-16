import { ContactRepository } from "../../shared/domain/repositories/contact-repository";
import { Contact } from "../../shared/domain/entities/contact";
import { CreateContactInput } from "./create-contact-input.dto";

export class CreateContactUseCase {
  public constructor(private readonly contactRepository: ContactRepository) {}

  public async execute(input: CreateContactInput): Promise<Contact> {
    const contact = Contact.create({
      nome: input.nome,
      dataNascimento: input.dataNascimento,
      sexo: input.sexo,
    });

    return this.contactRepository.create(contact);
  }
}
