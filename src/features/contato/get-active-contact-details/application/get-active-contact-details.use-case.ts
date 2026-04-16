import { ContactRepository } from "../../shared/domain/repositories/contact-repository";
import { ContactNotFoundError } from "../../shared/domain/errors/contact-errors";
import { Contact } from "../../shared/domain/entities/contact";

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
