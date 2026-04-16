import { Model, isValidObjectId } from "mongoose";

import { Contact } from "@contato/domain/entities/contact";
import {
  ContactNotFoundError,
  ContactValidationError,
} from "@contato/domain/errors/contact-errors";
import { ContactRepository } from "@contato/repositories/contact-repository";
import { ContactDocument } from "./contact-model";

export class MongooseContactRepository implements ContactRepository {
  public constructor(private readonly contactModel: Model<ContactDocument>) {}

  public async create(contact: Contact): Promise<Contact> {
    const created = await this.contactModel.create({
      nome: contact.nome,
      dataNascimento: contact.dataNascimento,
      sexo: contact.sexo,
      ativo: contact.ativo,
    });

    return this.toDomain(created);
  }

  public async save(contact: Contact): Promise<Contact> {
    if (!contact.id || !isValidObjectId(contact.id)) {
      throw new ContactValidationError("Id de contato invalido");
    }

    const updated = await this.contactModel
      .findByIdAndUpdate(
        contact.id,
        {
          nome: contact.nome,
          dataNascimento: contact.dataNascimento,
          sexo: contact.sexo,
          ativo: contact.ativo,
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!updated) {
      throw new ContactNotFoundError();
    }

    return this.toDomain(updated);
  }

  public async findById(id: string): Promise<Contact | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const found = await this.contactModel.findById(id).exec();
    if (!found) {
      return null;
    }

    return this.toDomain(found);
  }

  public async findActiveById(id: string): Promise<Contact | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const found = await this.contactModel
      .findOne({ _id: id, ativo: true })
      .exec();
    if (!found) {
      return null;
    }

    return this.toDomain(found);
  }

  public async listActive(): Promise<Contact[]> {
    const contacts = await this.contactModel
      .find({ ativo: true })
      .sort({ nome: 1 })
      .exec();
    return contacts.map((contact) => this.toDomain(contact));
  }

  public async deleteById(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }

    const deleted = await this.contactModel.findByIdAndDelete(id).exec();
    return Boolean(deleted);
  }

  private toDomain(document: ContactDocument): Contact {
    return Contact.rehydrate({
      id: document.id,
      nome: document.nome,
      dataNascimento: document.dataNascimento,
      sexo: document.sexo,
      ativo: document.ativo,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }
}
