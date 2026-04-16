import { UpdateActiveContactUseCase } from "@contato/use-cases/update-active-contact.use-case";
import { Contact } from "@contato/domain/entities/contact";
import { ContactNotFoundError } from "@contato/domain/errors/contact-errors";
import { ContactRepository } from "@contato/repositories/contact-repository";

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

describe("UpdateActiveContactUseCase", () => {
  it("deve atualizar contato ativo", async () => {
    const repository = createRepositoryMock();
    const useCase = new UpdateActiveContactUseCase(repository);

    const activeContact = Contact.rehydrate({
      id: "507f1f77bcf86cd799439011",
      nome: "Contato Antigo",
      dataNascimento: createBirthDateYearsAgo(31),
      sexo: "MASCULINO",
      ativo: true,
    });

    repository.findActiveById.mockResolvedValue(activeContact);
    repository.save.mockImplementation(async (contact: Contact) => contact);

    const result = await useCase.execute({
      id: "507f1f77bcf86cd799439011",
      nome: "Contato Novo",
      dataNascimento: createBirthDateYearsAgo(32),
      sexo: "FEMININO",
    });

    expect(repository.findActiveById).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
    );
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result.nome).toBe("Contato Novo");
    expect(result.sexo).toBe("FEMININO");
  });

  it("deve falhar ao atualizar contato inativo ou inexistente", async () => {
    const repository = createRepositoryMock();
    const useCase = new UpdateActiveContactUseCase(repository);

    repository.findActiveById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        id: "507f1f77bcf86cd799439011",
        nome: "Contato Novo",
        dataNascimento: createBirthDateYearsAgo(32),
        sexo: "FEMININO",
      }),
    ).rejects.toBeInstanceOf(ContactNotFoundError);
  });
});
