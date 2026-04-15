import dotenv from "dotenv";

dotenv.config();

const parsedPort = Number(process.env.PORT ?? 3000);

if (Number.isNaN(parsedPort) || parsedPort <= 0) {
  throw new Error("PORT precisa ser um numero valido maior que zero");
}

export const env = {
  port: parsedPort,
  mongoUri: process.env.MONGO_URI ?? "mongodb://localhost:27017/contatosdb",
};
