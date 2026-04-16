import { ContactRepository } from "../../shared/domain/repositories/contact-repository";
import { Contact } from "../../shared/domain/entities/contact";

export class ListActiveContactsUseCase {
  public constructor(private readonly contactRepository: ContactRepository) {}

  public async execute(): Promise<Contact[]> {
    return this.contactRepository.listActive();
  }
}
