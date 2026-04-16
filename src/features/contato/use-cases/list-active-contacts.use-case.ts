import { Contact } from "@contato/domain/entities/contact";
import { ContactRepository } from "@contato/repositories/contact-repository";

export class ListActiveContactsUseCase {
  public constructor(private readonly contactRepository: ContactRepository) {}

  public async execute(): Promise<Contact[]> {
    return this.contactRepository.listActive();
  }
}
