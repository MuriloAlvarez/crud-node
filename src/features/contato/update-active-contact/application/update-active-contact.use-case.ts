import { Contact } from "../../shared/domain/entities/contact";
import { ContactNotFoundError } from "../../shared/domain/errors/contact-errors";
import { ContactRepository } from "../../shared/domain/repositories/contact-repository";
import { UpdateActiveContactInput } from "./update-active-contact-input.dto";

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
