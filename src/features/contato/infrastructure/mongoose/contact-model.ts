import { Document, Model, Schema, model, models } from "mongoose";

import {
  CONTACT_SEX_VALUES,
  ContactSex,
} from "@contato/domain/entities/contact-sex";

export interface ContactDocument extends Document {
  nome: string;
  dataNascimento: Date;
  sexo: ContactSex;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<ContactDocument>(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    dataNascimento: {
      type: Date,
      required: true,
    },
    sexo: {
      type: String,
      enum: CONTACT_SEX_VALUES,
      required: true,
    },
    ativo: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "contatos",
  },
);

contactSchema.index({ ativo: 1 });

export const ContactModel: Model<ContactDocument> =
  (models.Contact as Model<ContactDocument> | undefined) ??
  model<ContactDocument>("Contact", contactSchema);
