import { ContactRepository } from "../domain/repositories/contact-repository";
import { ContactNotFoundError } from "../domain/errors/contact-errors";
import { Contact } from "../domain/entities/contact";

export class DeactivateContactUseCase {
  public constructor(private readonly contactRepository: ContactRepository) {}

  public async execute(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findById(id);

    if (!contact) {
      throw new ContactNotFoundError();
    }

    if (!contact.ativo) {
      return contact;
    }

    contact.deactivate();
    return this.contactRepository.save(contact);
  }
}
