import { UpdateActiveContactInput } from "@contato/dtos/update-active-contact-input.dto";
import { Contact } from "@contato/domain/entities/contact";
import { ContactNotFoundError } from "@contato/domain/errors/contact-errors";
import { ContactRepository } from "@contato/repositories/contact-repository";

export class UpdateActiveContactUseCase {
  public constructor(private readonly contactRepository: ContactRepository) {}

  public async execute(input: UpdateActiveContactInput): Promise<Contact> {
    const contact = await this.contactRepository.findActiveById(input.id);

    if (!contact) {
      throw new ContactNotFoundError();
    }

    contact.update({
      nome: input.nome,
      dataNascimento: input.dataNascimento,
      sexo: input.sexo,
    });

    return this.contactRepository.save(contact);
  }
}
