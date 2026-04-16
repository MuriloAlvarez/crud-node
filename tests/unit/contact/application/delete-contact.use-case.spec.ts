import { DeleteContactUseCase } from "@contato/use-cases/delete-contact.use-case";
import { ContactNotFoundError } from "@contato/domain/errors/contact-errors";
import { ContactRepository } from "@contato/repositories/contact-repository";

function createRepositoryMock(): jest.Mocked<ContactRepository> {
  return {
    create: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findActiveById: jest.fn(),
    listActive: jest.fn(),
    deleteById: jest.fn(),
  };
}

describe("DeleteContactUseCase", () => {
  it("deve remover contato existente", async () => {
    const repository = createRepositoryMock();
    const useCase = new DeleteContactUseCase(repository);

    repository.deleteById.mockResolvedValue(true);

    await expect(
      useCase.execute("507f1f77bcf86cd799439011"),
    ).resolves.toBeUndefined();
    expect(repository.deleteById).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
    );
  });

  it("deve falhar quando contato nao existe", async () => {
    const repository = createRepositoryMock();
    const useCase = new DeleteContactUseCase(repository);

    repository.deleteById.mockResolvedValue(false);

    await expect(
      useCase.execute("507f1f77bcf86cd799439011"),
    ).rejects.toBeInstanceOf(ContactNotFoundError);
  });
});
