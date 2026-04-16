# CRUD de Contatos - API REST com Node.js e TypeScript

## 1. Visao Geral

Este projeto implementa uma API REST para gerenciamento de contatos, usando arquitetura Vertical Slice orientada ao contexto de contato.

Operacoes implementadas:

- Criar contato
- Listar contatos ativos
- Obter detalhes de contato ativo
- Atualizar contato ativo
- Ativar contato
- Desativar contato
- Excluir contato

Objetivos tecnicos da organizacao:

- Baixo acoplamento entre regras de negocio e camada HTTP
- Alta coesao dentro do contexto de contato
- Facilidade para testar e evoluir casos de uso

## 2. Stack Tecnologico

- Node.js
- TypeScript
- Express 5
- MongoDB + Mongoose
- Jest
- Supertest
- mongodb-memory-server
- ts-jest

## 3. Estrutura Atual do Projeto

```text
crud-node/
├── src/
│   ├── app.ts
│   ├── main.ts
│   ├── features/
│   │   └── contato/
│   │       ├── index.ts
│   │       ├── contacts-module.ts
│   │       ├── controllers/
│   │       │   └── contact.controller.ts
│   │       ├── use-cases/
│   │       │   ├── create-contact.use-case.ts
│   │       │   ├── list-active-contacts.use-case.ts
│   │       │   ├── get-active-contact-details.use-case.ts
│   │       │   ├── update-active-contact.use-case.ts
│   │       │   ├── activate-contact.use-case.ts
│   │       │   ├── deactivate-contact.use-case.ts
│   │       │   └── delete-contact.use-case.ts
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   │   ├── contact.ts
│   │       │   │   └── contact-sex.ts
│   │       │   ├── errors/
│   │       │   │   └── contact-errors.ts
│   │       │   └── services/
│   │       │       └── age-calculator.ts
│   │       ├── dtos/
│   │       │   ├── create-contact-input.dto.ts
│   │       │   ├── update-active-contact-input.dto.ts
│   │       │   └── contact-response.dto.ts
│   │       ├── validations/
│   │       │   ├── create-contact.validation.ts
│   │       │   ├── update-active-contact.validation.ts
│   │       │   ├── list-active-contacts.validation.ts
│   │       │   └── parse-contact-id.validation.ts
│   │       ├── repositories/
│   │       │   └── contact-repository.ts
│   │       └── infrastructure/
│   │           └── mongoose/
│   │               ├── contact-model.ts
│   │               └── mongoose-contact-repository.ts
│   └── shared/
│       ├── config/
│       │   └── env.ts
│       ├── database/
│       │   └── mongoose.ts
│       └── http/
│           ├── app-error.ts
│           ├── async-handler.ts
│           └── error-handler.ts
├── tests/
│   ├── integration/
│   │   └── contact-routes.spec.ts
│   └── unit/
│       └── contact/
│           ├── application/
│           └── domain/
├── package.json
├── tsconfig.json
├── jest.config.js
└── .env.example
```

Resumo de responsabilidades:

- controllers: define rotas HTTP e conecta validacao, use-cases e resposta
- use-cases: executa regra de negocio por operacao
- domain: entidade, erros de negocio e servicos de dominio
- repositories: contrato de persistencia
- infrastructure/mongoose: implementacao concreta do repositorio
- shared: config, conexao de banco e tratamento padrao de erro HTTP

## 4. Arquitetura e Fluxo da Requisicao

Fluxo padrao de uma chamada:

1. app.ts recebe a requisicao e encaminha para /api/contatos
2. contact.controller.ts executa parse e validacao da entrada
3. use-case correspondente aplica regra de negocio
4. repositorio Mongoose acessa MongoDB
5. DTO de resposta converte entidade para payload HTTP
6. error-handler padroniza erros da aplicacao

Esse desenho evita regra de negocio espalhada em controller e centraliza comportamento no dominio/use-cases.

## 5. Entidade Contact e Regras de Negocio

Regras principais:

- nome e obrigatorio e precisa ter ao menos 3 caracteres
- dataNascimento precisa ser data valida
- dataNascimento nao pode estar no futuro
- contato precisa ser maior de idade (18+)
- sexo aceita apenas MASCULINO, FEMININO ou OUTRO
- idade e calculada em tempo de execucao (nao e campo persistido)

Comportamento dos casos de uso:

- listar e detalhar retornam apenas contatos ativos
- atualizar funciona apenas para contato ativo
- ativar/desativar sao operacoes idempotentes
- excluir remove o documento fisicamente

## 6. Setup e Execucao Local

### 6.1 Pre-requisitos

- Node.js instalado
- MongoDB disponivel (local ou remoto)

### 6.2 Variaveis de ambiente

Crie o arquivo .env com base no exemplo:

```bash
cp .env.example .env
```

Valores atuais:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/contatosdb
```

Observacoes:

- se PORT nao for informado, o padrao e 3000
- se MONGO_URI nao for informado, o padrao e mongodb://localhost:27017/contatosdb
- PORT invalido (NaN, zero ou negativo) interrompe inicializacao

### 6.3 Instalar dependencias e subir em desenvolvimento

Com Yarn:

```bash
corepack enable
yarn install
yarn dev
```

Com npm:

```bash
npm install
npm run dev
```

### 6.4 Build e execucao

```bash
yarn build
yarn start
```

### 6.5 Health check

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

## 7. Endpoints da API

Base path: /api/contatos

| Metodo | Rota                        | Descricao               | Sucesso |
| ------ | --------------------------- | ----------------------- | ------- |
| POST   | /api/contatos               | Criar contato           | 201     |
| GET    | /api/contatos               | Listar contatos ativos  | 200     |
| GET    | /api/contatos/:id           | Detalhar contato ativo  | 200     |
| PUT    | /api/contatos/:id           | Atualizar contato ativo | 200     |
| PATCH  | /api/contatos/:id/ativar    | Ativar contato          | 200     |
| PATCH  | /api/contatos/:id/desativar | Desativar contato       | 200     |
| DELETE | /api/contatos/:id           | Excluir contato         | 204     |

### Exemplo de criacao

Request:

```json
{
  "nome": "Maria Silva",
  "dataNascimento": "1990-01-10T00:00:00.000Z",
  "sexo": "FEMININO"
}
```

Response 201:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "nome": "Maria Silva",
  "dataNascimento": "1990-01-10T00:00:00.000Z",
  "sexo": "FEMININO",
  "idade": 35,
  "ativo": true
}
```

## 8. Padrao de Erro da API

Formato:

```json
{
  "code": "CONTACT_VALIDATION_ERROR",
  "message": "Campo nome e obrigatorio"
}
```

Codigos mais comuns:

- CONTACT_VALIDATION_ERROR (400): erro de validacao de entrada ou regra de dominio
- CONTACT_NOT_FOUND (404): contato inexistente ou nao elegivel para operacao
- INVALID_ID (400): identificador invalido no fluxo HTTP/mongoose
- INTERNAL_SERVER_ERROR (500): erro inesperado

## 9. Scripts Disponiveis

| Script     | Comando                     | Objetivo                   |
| ---------- | --------------------------- | -------------------------- |
| dev        | tsx watch src/main.ts       | desenvolvimento com reload |
| build      | tsc -p tsconfig.json        | gera dist                  |
| start      | node dist/main.js           | executa build em producao  |
| lint       | tsc --noEmit                | validacao de tipos         |
| test       | jest --coverage --runInBand | testes + cobertura         |
| test:watch | jest --watch                | testes em watch            |

## 10. Testes e Cobertura

Suites existentes:

- Unitario de dominio: entidade Contact
- Unitarios de aplicacao: 7 use-cases
- Integracao: rotas de contato com Supertest e mongodb-memory-server

Comandos:

```bash
yarn test
yarn test:watch
```

Threshold global de cobertura:

- statements: 80
- functions: 80
- lines: 80

Escopo principal de cobertura:

- src/features/contato/use-cases
- src/features/contato/controllers
- src/features/contato/validations
- src/features/contato/dtos
- src/features/contato/domain
- src/features/contato/repositories
- src/shared

Exclusoes atuais:

- src/features/contato/infrastructure
- src/main.ts
- src/app.ts

## 11. Como Adicionar um Novo Caso de Uso

Passo a passo sugerido:

1. Criar DTO de entrada (se necessario) em src/features/contato/dtos
2. Criar validacao em src/features/contato/validations
3. Implementar use-case em src/features/contato/use-cases
4. Reutilizar/estender contrato de repositorio em src/features/contato/repositories
5. Implementar ajuste de persistencia em src/features/contato/infrastructure/mongoose
6. Expor rota no controller central em src/features/contato/controllers/contact.controller.ts
7. Criar teste unitario do use-case em tests/unit/contact/application
8. Criar/ajustar teste de integracao em tests/integration/contact-routes.spec.ts

## 12. Notas de Persistencia

- Banco padrao: MongoDB
- Colecao: contatos
- indice ativo: 1 definido no schema
- listagem de ativos e ordenada por nome ascendente

## 13. Observacao sobre Estrutura Legada

Pastas numeradas como 0-presentation, 1-application, 2-domain e 3-infrastructure podem aparecer em artefatos de cobertura antigos, mas nao fazem parte da estrutura ativa atual de src.

## 14. Criterios Tecnicos Atendidos

- API REST em Node.js com TypeScript
- Persistencia em MongoDB via Mongoose
- Separacao clara entre HTTP, aplicacao, dominio e infraestrutura
- Arquitetura orientada a contexto Vertical Slice
- Testes unitarios e de integracao com cobertura minima configurada
