import { ContactNotFoundError } from "@contato/domain/errors/contact-errors";
import { ContactRepository } from "@contato/repositories/contact-repository";

export class DeleteContactUseCase {
  public constructor(private readonly contactRepository: ContactRepository) {}

  public async execute(id: string): Promise<void> {
    const wasDeleted = await this.contactRepository.deleteById(id);

    if (!wasDeleted) {
      throw new ContactNotFoundError();
    }
  }
}
