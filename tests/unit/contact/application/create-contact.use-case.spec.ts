import { CreateContactUseCase } from "../../../../src/features/contato/create-contact/application/create-contact.use-case";
import { ContactRepository } from "../../../../src/features/contato/shared/domain/repositories/contact-repository";
import { Contact } from "../../../../src/features/contato/shared/domain/entities/contact";

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

describe("CreateContactUseCase", () => {
  it("deve criar contato no repositorio", async () => {
    const repository = createRepositoryMock();
    const useCase = new CreateContactUseCase(repository);

    repository.create.mockImplementation(async (contact: Contact) =>
      Contact.rehydrate({
        id: "507f1f77bcf86cd799439011",
        nome: contact.nome,
        dataNascimento: contact.dataNascimento,
        sexo: contact.sexo,
        ativo: contact.ativo,
      }),
    );

    const created = await useCase.execute({
      nome: "Ana Maria",
      dataNascimento: createBirthDateYearsAgo(28),
      sexo: "FEMININO",
    });

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(created.id).toBe("507f1f77bcf86cd799439011");
    expect(created.nome).toBe("Ana Maria");
    expect(created.ativo).toBe(true);
  });
});
