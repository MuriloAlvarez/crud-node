import { Contact } from "@contato/domain/entities/contact";
import { ContactNotFoundError } from "@contato/domain/errors/contact-errors";
import { ContactRepository } from "@contato/repositories/contact-repository";

export class GetActiveContactDetailsUseCase {
  public constructor(private readonly contactRepository: ContactRepository) {}

  public async execute(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findActiveById(id);

    if (!contact) {
      throw new ContactNotFoundError();
    }

    return contact;
  }
}
