import { ListActiveContactsUseCase } from "../../../../src/features/contato/list-active-contacts/application/list-active-contacts.use-case";
import { Contact } from "../../../../src/features/contato/shared/domain/entities/contact";
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

describe("ListActiveContactsUseCase", () => {
  it("deve listar contatos ativos do repositorio", async () => {
    const repository = createRepositoryMock();
    const useCase = new ListActiveContactsUseCase(repository);

    repository.listActive.mockResolvedValue([
      Contact.rehydrate({
        id: "507f1f77bcf86cd799439011",
        nome: "Alice",
        dataNascimento: createBirthDateYearsAgo(29),
        sexo: "FEMININO",
        ativo: true,
      }),
      Contact.rehydrate({
        id: "507f1f77bcf86cd799439012",
        nome: "Bruno",
        dataNascimento: createBirthDateYearsAgo(34),
        sexo: "MASCULINO",
        ativo: true,
      }),
    ]);

    const contacts = await useCase.execute();

    expect(repository.listActive).toHaveBeenCalledTimes(1);
    expect(contacts).toHaveLength(2);
    expect(contacts[0].ativo).toBe(true);
  });
});
