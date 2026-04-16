import { GetActiveContactDetailsUseCase } from "../../../../src/features/contato/get-active-contact-details/application/get-active-contact-details.use-case";
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

describe("GetActiveContactDetailsUseCase", () => {
  it("deve retornar contato ativo", async () => {
    const repository = createRepositoryMock();
    const useCase = new GetActiveContactDetailsUseCase(repository);

    const activeContact = Contact.rehydrate({
      id: "507f1f77bcf86cd799439011",
      nome: "Contato Ativo",
      dataNascimento: createBirthDateYearsAgo(40),
      sexo: "MASCULINO",
      ativo: true,
    });

    repository.findActiveById.mockResolvedValue(activeContact);

    const result = await useCase.execute("507f1f77bcf86cd799439011");

    expect(result.id).toBe("507f1f77bcf86cd799439011");
    expect(result.ativo).toBe(true);
  });

  it("deve falhar quando contato nao esta ativo ou nao existe", async () => {
    const repository = createRepositoryMock();
    const useCase = new GetActiveContactDetailsUseCase(repository);

    repository.findActiveById.mockResolvedValue(null);

    await expect(
      useCase.execute("507f1f77bcf86cd799439011"),
    ).rejects.toBeInstanceOf(ContactNotFoundError);
  });
});
