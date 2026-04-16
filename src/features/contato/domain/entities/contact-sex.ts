export const CONTACT_SEX_VALUES = ["MASCULINO", "FEMININO", "OUTRO"] as const;

export type ContactSex = (typeof CONTACT_SEX_VALUES)[number];
