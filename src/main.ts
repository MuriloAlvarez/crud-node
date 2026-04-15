import { createApp } from "./app";
import { env } from "./shared/config/env";
import { connectToDatabase } from "./shared/database/mongoose";

async function bootstrap(): Promise<void> {
  await connectToDatabase(env.mongoUri);
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Servidor executando em http://localhost:${env.port}`);
  });
}

void bootstrap().catch((error: unknown) => {
  console.error("Falha ao iniciar a aplicacao", error);
  process.exit(1);
});
