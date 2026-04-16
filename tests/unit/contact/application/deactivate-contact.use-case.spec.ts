import { DeactivateContactUseCase } from "../../../../src/features/contato/deactivate-contact/application/deactivate-contact.use-case";
import { Contact } from "../../../../src/features/contato/shared/domain/entities/contact";
import { ContactNotFoundError } from "../../../../src/features/contato/shared/domain/errors/contact-errors";
import { ContactRepository } from "../../../../src/features/contato/shared/domain/repositories/contact-repository";

function createBirthDateYearsAgo(years: number): Date {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() - years);
  date.setUTCDate(date.getUTCDate() - 1);
  return date;
}

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

describe("DeactivateContactUseCase", () => {
  it("deve desativar contato existente", async () => {
    const repository = createRepositoryMock();
    const useCase = new DeactivateContactUseCase(repository);

    const activeContact = Contact.rehydrate({
      id: "507f1f77bcf86cd799439011",
      nome: "Contato Ativo",
      dataNascimento: createBirthDateYearsAgo(30),
      sexo: "MASCULINO",
      ativo: true,
    });

    repository.findById.mockResolvedValue(activeContact);
    repository.save.mockImplementation(async (contact: Contact) => contact);

    const result = await useCase.execute("507f1f77bcf86cd799439011");

    expect(repository.findById).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
    );
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result.ativo).toBe(false);
  });

  it("deve falhar ao desativar contato inexistente", async () => {
    const repository = createRepositoryMock();
    const useCase = new DeactivateContactUseCase(repository);

    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute("id-invalido")).rejects.toBeInstanceOf(
      ContactNotFoundError,
    );
  });
});
