import { Contact } from "../../../../src/features/contato/shared/domain/entities/contact";

function createBirthDateYearsAgo(years: number): Date {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() - years);
  date.setUTCDate(date.getUTCDate() - 1);
  return date;
}

describe("Contact domain entity", () => {
  it("deve criar contato valido calculando idade em tempo de execucao", () => {
    const contact = Contact.create({
      nome: "Maria Silva",
      dataNascimento: createBirthDateYearsAgo(25),
      sexo: "FEMININO",
    });

    expect(contact.ativo).toBe(true);
    expect(contact.idade).toBeGreaterThanOrEqual(25);
  });

  it("deve impedir data de nascimento no futuro", () => {
    const futureDate = new Date();
    futureDate.setUTCDate(futureDate.getUTCDate() + 1);

    expect(() =>
      Contact.create({
        nome: "Joao Silva",
        dataNascimento: futureDate,
        sexo: "MASCULINO",
      }),
    ).toThrow("Data de nascimento nao pode ser maior que hoje");
  });

  it("deve impedir menor de idade", () => {
    expect(() =>
      Contact.create({
        nome: "Carlos Junior",
        dataNascimento: createBirthDateYearsAgo(17),
        sexo: "MASCULINO",
      }),
    ).toThrow("Contato precisa ser maior de idade");
  });

  it("deve exigir nome com ao menos 3 caracteres", () => {
    expect(() =>
      Contact.create({
        nome: "ab",
        dataNascimento: createBirthDateYearsAgo(30),
        sexo: "OUTRO",
      }),
    ).toThrow("Nome precisa ter ao menos 3 caracteres");
  });
});
