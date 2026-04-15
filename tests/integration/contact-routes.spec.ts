import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { createApp } from "../../src/app";
import {
  clearDatabase,
  connectToDatabase,
  disconnectFromDatabase,
} from "../../src/shared/database/mongoose";

function createBirthDateYearsAgoIso(years: number): string {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() - years);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString();
}

describe("Contact routes integration", () => {
  const app = createApp();
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectToDatabase(mongoServer.getUri());
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
    await mongoServer.stop();
  });

  it("deve criar contato valido", async () => {
    const response = await request(app)
      .post("/api/contatos")
      .send({
        nome: "Contato Integracao",
        dataNascimento: createBirthDateYearsAgoIso(29),
        sexo: "MASCULINO",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        nome: "Contato Integracao",
        sexo: "MASCULINO",
        ativo: true,
      }),
    );
    expect(response.body.idade).toBeGreaterThanOrEqual(29);
  });

  it("deve rejeitar menor de idade", async () => {
    const response = await request(app)
      .post("/api/contatos")
      .send({
        nome: "Contato Menor",
        dataNascimento: createBirthDateYearsAgoIso(12),
        sexo: "FEMININO",
      });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("CONTACT_VALIDATION_ERROR");
  });

  it("deve listar apenas contatos ativos", async () => {
    const first = await request(app)
      .post("/api/contatos")
      .send({
        nome: "Contato Ativo",
        dataNascimento: createBirthDateYearsAgoIso(31),
        sexo: "FEMININO",
      });

    const second = await request(app)
      .post("/api/contatos")
      .send({
        nome: "Contato Para Desativar",
        dataNascimento: createBirthDateYearsAgoIso(35),
        sexo: "MASCULINO",
      });

    await request(app)
      .patch(`/api/contatos/${second.body.id}/desativar`)
      .send();

    const listResponse = await request(app).get("/api/contatos");

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].id).toBe(first.body.id);
  });

  it("deve bloquear detalhes de contato desativado", async () => {
    const created = await request(app)
      .post("/api/contatos")
      .send({
        nome: "Contato Inativo",
        dataNascimento: createBirthDateYearsAgoIso(28),
        sexo: "OUTRO",
      });

    await request(app)
      .patch(`/api/contatos/${created.body.id}/desativar`)
      .send();

    const response = await request(app).get(`/api/contatos/${created.body.id}`);

    expect(response.status).toBe(404);
    expect(response.body.code).toBe("CONTACT_NOT_FOUND");
  });

  it("deve atualizar contato ativo", async () => {
    const created = await request(app)
      .post("/api/contatos")
      .send({
        nome: "Contato Atualizar",
        dataNascimento: createBirthDateYearsAgoIso(33),
        sexo: "MASCULINO",
      });

    const response = await request(app)
      .put(`/api/contatos/${created.body.id}`)
      .send({
        nome: "Contato Atualizado",
        dataNascimento: createBirthDateYearsAgoIso(34),
        sexo: "FEMININO",
      });

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe("Contato Atualizado");
    expect(response.body.sexo).toBe("FEMININO");
    expect(response.body.ativo).toBe(true);
  });

  it("deve bloquear atualizacao de contato inativo", async () => {
    const created = await request(app)
      .post("/api/contatos")
      .send({
        nome: "Contato Inativo Atualizacao",
        dataNascimento: createBirthDateYearsAgoIso(29),
        sexo: "OUTRO",
      });

    await request(app)
      .patch(`/api/contatos/${created.body.id}/desativar`)
      .send();

    const response = await request(app)
      .put(`/api/contatos/${created.body.id}`)
      .send({
        nome: "Contato Nao Deve Atualizar",
        dataNascimento: createBirthDateYearsAgoIso(30),
        sexo: "FEMININO",
      });

    expect(response.status).toBe(404);
    expect(response.body.code).toBe("CONTACT_NOT_FOUND");
  });

  it("deve ativar contato desativado", async () => {
    const created = await request(app)
      .post("/api/contatos")
      .send({
        nome: "Contato Reativar",
        dataNascimento: createBirthDateYearsAgoIso(41),
        sexo: "MASCULINO",
      });

    await request(app)
      .patch(`/api/contatos/${created.body.id}/desativar`)
      .send();

    const activateResponse = await request(app)
      .patch(`/api/contatos/${created.body.id}/ativar`)
      .send();

    expect(activateResponse.status).toBe(200);
    expect(activateResponse.body.ativo).toBe(true);

    const detailResponse = await request(app).get(
      `/api/contatos/${created.body.id}`,
    );
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.ativo).toBe(true);
  });

  it("deve excluir contato", async () => {
    const created = await request(app)
      .post("/api/contatos")
      .send({
        nome: "Contato Excluir",
        dataNascimento: createBirthDateYearsAgoIso(45),
        sexo: "MASCULINO",
      });

    const deleteResponse = await request(app).delete(
      `/api/contatos/${created.body.id}`,
    );
    expect(deleteResponse.status).toBe(204);

    const detailResponse = await request(app).get(
      `/api/contatos/${created.body.id}`,
    );
    expect(detailResponse.status).toBe(404);
  });
});
