import { ContactRepository } from "../domain/repositories/contact-repository";
import { Contact } from "../domain/entities/contact";

export class ListActiveContactsUseCase {
  public constructor(private readonly contactRepository: ContactRepository) {}

  public async execute(): Promise<Contact[]> {
    return this.contactRepository.listActive();
  }
}
