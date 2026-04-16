import { CreateContactInput } from "@contato/dtos/create-contact-input.dto";
import { Contact } from "@contato/domain/entities/contact";
import { ContactRepository } from "@contato/repositories/contact-repository";

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
