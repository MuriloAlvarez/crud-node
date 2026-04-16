import { Contact } from "@contato/domain/entities/contact";

export interface ContactRepository {
  create(contact: Contact): Promise<Contact>;
  save(contact: Contact): Promise<Contact>;
  findById(id: string): Promise<Contact | null>;
  findActiveById(id: string): Promise<Contact | null>;
  listActive(): Promise<Contact[]>;
  deleteById(id: string): Promise<boolean>;
}
