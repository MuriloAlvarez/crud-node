# CRUD de Contatos - Processo Seletivo Node

API REST para criar, listar, visualizar, desativar e excluir contatos, com persistencia em MongoDB, organizacao em Vertical Slice e testes automatizados.

## Stack

- Node.js
- TypeScript
- Express
- MongoDB com Mongoose
- Jest + Supertest

## Regras de Negocio Implementadas

- Campos do contato: `nome`, `dataNascimento`, `sexo`, `idade`.
- A `idade` e calculada em tempo de execucao.
- O contato precisa ser maior de idade (18+).
- A idade nao pode ser menor que zero.
- A data de nascimento nao pode ser maior que a data atual.
- Apenas contatos ativos aparecem na listagem.
- Apenas contatos ativos podem ter detalhes consultados.
- Desativacao e feita por soft delete (`ativo = false`).
- Exclusao remove fisicamente o registro.

## Arquitetura (Vertical Slice)

```
src/
  features/
    contato/
      create-contact/
      list-active-contacts/
      get-active-contact-details/
      deactivate-contact/
      delete-contact/
  shared/
```

### Separacao de Responsabilidades

- Cada pasta de caso de uso contem seu endpoint, handler, validator e response.
- Cada pasta de caso de uso contem sua camada de application, domain e infrastructure.
- O modulo fica isolado por fatia funcional, reduzindo acoplamento entre casos de uso.

## Endpoints

Base URL: `http://localhost:3000/api/contatos`

- `POST /` cria contato
- `GET /` lista contatos ativos
- `GET /:id` detalhes de contato ativo
- `PATCH /:id/desativar` desativa contato
- `DELETE /:id` exclui contato

### Exemplo de Criacao

```json
{
  "nome": "Maria Silva",
  "dataNascimento": "1990-04-10T00:00:00.000Z",
  "sexo": "FEMININO"
}
```

## Como Executar

1. Copie `.env.example` para `.env`.
2. Ajuste `MONGO_URI` se necessario.
3. Instale dependencias:

```bash
npm install
```

4. Rode em desenvolvimento:

```bash
npm run dev
```

## Build e Execucao

```bash
npm run build
npm start
```

## Testes

```bash
npm test
```

- Testes unitarios validam regras de dominio e casos de uso.
- Testes de integracao validam os fluxos REST com Mongo em memoria.
- Cobertura minima global configurada em 80%.
