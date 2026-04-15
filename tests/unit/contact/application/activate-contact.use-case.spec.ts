import { ActivateContactUseCase } from "../../../../src/features/contato/activate-contact/application/activate-contact.use-case";
import { Contact } from "../../../../src/features/contato/activate-contact/domain/entities/contact";
import { ContactNotFoundError } from "../../../../src/features/contato/activate-contact/domain/errors/contact-errors";
import { ContactRepository } from "../../../../src/features/contato/activate-contact/domain/repositories/contact-repository";

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

describe("ActivateContactUseCase", () => {
  it("deve ativar contato inativo", async () => {
    const repository = createRepositoryMock();
    const useCase = new ActivateContactUseCase(repository);

    const inactiveContact = Contact.rehydrate({
      id: "507f1f77bcf86cd799439011",
      nome: "Contato Inativo",
      dataNascimento: createBirthDateYearsAgo(30),
      sexo: "OUTRO",
      ativo: false,
    });

    repository.findById.mockResolvedValue(inactiveContact);
    repository.save.mockImplementation(async (contact: Contact) => contact);

    const result = await useCase.execute("507f1f77bcf86cd799439011");

    expect(repository.findById).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
    );
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result.ativo).toBe(true);
  });

  it("deve falhar ao ativar contato inexistente", async () => {
    const repository = createRepositoryMock();
    const useCase = new ActivateContactUseCase(repository);

    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute("id-invalido")).rejects.toBeInstanceOf(
      ContactNotFoundError,
    );
  });
});
