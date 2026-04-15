import { CONTACT_SEX_VALUES, ContactSex } from "./contact-sex";
import { ContactValidationError } from "../errors/contact-errors";
import { AgeCalculator } from "../services/age-calculator";

export type ContactProps = {
  id?: string;
  nome: string;
  dataNascimento: Date;
  sexo: ContactSex;
  ativo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type NewContactProps = Omit<ContactProps, "ativo"> & {
  ativo?: boolean;
};

export class Contact {
  private readonly props: ContactProps;

  private constructor(props: ContactProps) {
    this.props = props;
  }

  public static create(props: NewContactProps): Contact {
    const nome = this.normalizeName(props.nome);
    this.validateSex(props.sexo);
    this.validateBirthDate(props.dataNascimento);
    this.validateAdult(props.dataNascimento);

    return new Contact({
      ...props,
      nome,
      ativo: props.ativo ?? true,
    });
  }

  public static rehydrate(props: ContactProps): Contact {
    return new Contact(props);
  }

  public get id(): string | undefined {
    return this.props.id;
  }

  public get nome(): string {
    return this.props.nome;
  }

  public get dataNascimento(): Date {
    return this.props.dataNascimento;
  }

  public get sexo(): ContactSex {
    return this.props.sexo;
  }

  public get ativo(): boolean {
    return this.props.ativo;
  }

  public get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public get idade(): number {
    return AgeCalculator.calculate(this.props.dataNascimento);
  }

  public deactivate(): void {
    this.props.ativo = false;
    this.props.updatedAt = new Date();
  }

  public activate(): void {
    this.props.ativo = true;
    this.props.updatedAt = new Date();
  }

  private static normalizeName(name: string): string {
    const normalizedName = name.trim();

    if (normalizedName.length < 3) {
      throw new ContactValidationError(
        "Nome precisa ter ao menos 3 caracteres",
      );
    }

    return normalizedName;
  }

  private static validateSex(sex: ContactSex): void {
    if (!CONTACT_SEX_VALUES.includes(sex)) {
      throw new ContactValidationError("Sexo informado e invalido");
    }
  }

  private static validateBirthDate(date: Date): void {
    if (Number.isNaN(date.getTime())) {
      throw new ContactValidationError("Data de nascimento invalida");
    }

    const now = new Date();
    if (date.getTime() > now.getTime()) {
      throw new ContactValidationError(
        "Data de nascimento nao pode ser maior que hoje",
      );
    }

    const age = AgeCalculator.calculate(date, now);
    if (age < 0) {
      throw new ContactValidationError("Idade nao pode ser menor que zero");
    }
  }

  private static validateAdult(date: Date): void {
    const age = AgeCalculator.calculate(date);

    if (age < 18) {
      throw new ContactValidationError("Contato precisa ser maior de idade");
    }
  }
}
