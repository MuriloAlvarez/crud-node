import { ContactRepository } from "../../shared/domain/repositories/contact-repository";
import { ContactNotFoundError } from "../../shared/domain/errors/contact-errors";

export class DeleteContactUseCase {
  public constructor(private readonly contactRepository: ContactRepository) {}

  public async execute(id: string): Promise<void> {
    const wasDeleted = await this.contactRepository.deleteById(id);

    if (!wasDeleted) {
      throw new ContactNotFoundError();
    }
  }
}
