# CRUD de Contatos - Node.js (Vertical Slice)

## 1. Visao Geral

Este projeto implementa uma API REST para gerenciamento de contatos, seguindo uma arquitetura Vertical Slice por caso de uso.

Escopo implementado:

- Criar contato
- Listar contatos ativos
- Visualizar detalhes de contato ativo
- Atualizar contato ativo
- Ativar contato
- Desativar contato
- Excluir contato

A solucao foi organizada para baixo acoplamento, alta coesao e boa testabilidade.

## 2. Tecnologias Utilizadas

- Node.js
- TypeScript
- Express 5
- MongoDB com Mongoose
- Jest
- Supertest
- mongodb-memory-server
- ts-jest

## 3. Estrutura do Projeto

```text
crud-node/
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env.example
├── README.md
├── src/
│   ├── app.ts
│   ├── main.ts
│   ├── features/
│   │   └── contato/
│   │       ├── index.ts
│   │       ├── activate-contact/
│   │       ├── create-contact/
│   │       ├── deactivate-contact/
│   │       ├── delete-contact/
│   │       ├── get-active-contact-details/
│   │       ├── list-active-contacts/
│   │       └── update-active-contact/
│   └── shared/
│       ├── config/
│       ├── database/
│       └── http/
└── tests/
    ├── integration/
    └── unit/
```

Cada slice de contato contem sua propria estrutura de:

- endpoint
- handler
- validator
- response
- application
- domain
- infrastructure

## 4. Como Rodar a Aplicacao

### 4.1 Pre-requisitos

- Node.js instalado
- MongoDB disponivel (local ou remoto)

### 4.2 Configuracao de ambiente

Crie seu arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

Exemplo de configuracao:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/contatosdb
```

### 4.3 Instalar dependencias e executar

```bash
npm install
npm run dev
```

Ao subir, a API ficara disponivel no host configurado (por padrao, porta 3000).

Health check:

```http
GET /health
```

## 5. Endpoints da API

Base path: `/api/contatos`

### 5.1 Criar contato

`POST /api/contatos`

Exemplo de request:

```json
{
  "nome": "Maria Silva",
  "dataNascimento": "1990-01-10T00:00:00.000Z",
  "sexo": "FEMININO"
}
```

### 5.2 Listar contatos ativos

`GET /api/contatos`

### 5.3 Obter detalhes de contato ativo

`GET /api/contatos/{id}`

### 5.4 Desativar contato

`PATCH /api/contatos/{id}/desativar`

### 5.5 Atualizar contato ativo

`PUT /api/contatos/{id}`

### 5.6 Ativar contato

`PATCH /api/contatos/{id}/ativar`

### 5.7 Excluir contato

`DELETE /api/contatos/{id}`

Observacao:

- Desativacao e soft delete funcional (`ativo = false`).
- Exclusao e fisica (remove o documento do banco).

## 6. Regras de Negocio

As regras ficam centralizadas no dominio e nos validators dos slices:

- Nome obrigatorio e com no minimo 3 caracteres.
- Data de nascimento obrigatoria e valida.
- Data de nascimento nao pode ser maior que a data atual.
- Contato deve ser maior de idade (`>= 18`).
- Sexo deve ser um valor valido: `MASCULINO`, `FEMININO` ou `OUTRO`.
- Idade e calculada em tempo de execucao, nao persistida.
- Listagem, detalhes e atualizacao consideram apenas contatos ativos.

## 7. Como a Aplicacao Funciona Internamente

Fluxo simplificado de uma requisicao:

1. O endpoint do slice recebe o request.
2. O validator do slice valida entrada e formato.
3. O use case executa regra de negocio.
4. O repositorio persiste/busca dados via Mongoose.
5. O response mapper devolve DTO com idade calculada em runtime.

Esse fluxo evita espalhar regra de negocio na camada HTTP.

## 8. Arquitetura Adotada e Motivacoes

### 8.1 Por que Vertical Slice

A estrutura por caso de uso foi escolhida para:

- Organizar por funcionalidade, nao por camada tecnica horizontal.
- Reduzir acoplamento entre operacoes.
- Facilitar manutencao e evolucao incremental.
- Melhorar rastreabilidade de ponta a ponta por operacao.

### 8.2 Onde estao as responsabilidades

- `src/features/contato/*`: casos de uso de contatos.
- `src/shared/database`: conexao e utilitarios de banco.
- `src/shared/http`: padrao de erros e middleware de tratamento.
- `tests/*`: validacao unitario + integracao.

## 9. Decisoes de Design (SOLID)

- SRP: cada slice tem responsabilidade unica por caso de uso.
- OCP: novas operacoes entram como novos slices, sem quebrar os existentes.
- LSP: contratos de repositorio com comportamento previsivel.
- ISP: contratos de uso direto e enxutos por slice.
- DIP: handlers dependem de abstrações de use case/repository, nao de detalhes HTTP.

## 10. Testes Automatizados

### 10.1 Rodar os testes

```bash
npm test
```

Modo watch:

```bash
npm run test:watch
```

### 10.2 Tipos de teste implementados

Unitarios:

- entidade de dominio `Contact`
- use cases de criar, listar ativos, obter detalhes, atualizar ativo, ativar, desativar e excluir

Integracao (Supertest + Mongo em memoria):

- criacao valida/invalida
- listagem somente de ativos
- bloqueio de detalhes para contato desativado
- atualizacao permitida apenas para contato ativo
- ativacao de contato desativado
- exclusao seguida de 404 no GET

Cobertura:

- threshold global configurado em 80% para statements, functions e lines.

## 11. Persistencia e Dados

Banco padrao: MongoDB.

- O schema e definido com Mongoose em cada slice.
- A conexao usa `MONGO_URI`.
- IDs invalidos sao tratados como erro de validacao/not found conforme fluxo do caso de uso.

## 12. Criterios Tecnicos Atendidos no Escopo Atual

- API REST em Node.js com TypeScript.
- Persistencia em banco NoSQL (MongoDB) com Mongoose.
- Separacao de regras de negocio e camada de apresentacao.
- Arquitetura Vertical Slice por caso de uso.
- Testes unitarios e de integracao com execucao automatizada.

Se quiser, posso complementar este README com:

- colecao de requests para Postman/Insomnia,
- secao de troubleshooting (MongoDB e variaveis de ambiente),
- sugestao de pipeline CI (lint + test + build).
