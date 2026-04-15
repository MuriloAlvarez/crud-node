import { Contact } from "../domain/entities/contact";
import { ContactNotFoundError } from "../domain/errors/contact-errors";
import { ContactRepository } from "../domain/repositories/contact-repository";

export class ActivateContactUseCase {
  public constructor(private readonly contactRepository: ContactRepository) {}

  public async execute(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findById(id);

    if (!contact) {
      throw new ContactNotFoundError();
    }

    if (contact.ativo) {
      return contact;
    }

    contact.activate();
    return this.contactRepository.save(contact);
  }
}
