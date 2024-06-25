import { app } from './app';
import { sql } from './infrastructures/sql';

const port: string | number = Bun.env.PORT! || 4000;

app.listen(port, async (server) => {
  console.log(`${server.id ?? 'server'} is live!`);
  console.log(`🦊 Elysia is running at ${server.hostname}:${server.port}`);
  await Promise.all([sql.authenticate()]);
});
