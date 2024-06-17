import { app } from './app';
import { sql } from './infrastructures/sql';
async function main() {
  app.listen(Bun.env.PORT! || 4000, async (server) => {
    console.log(`${server.id ?? 'server'} is live!`);
    console.log(`🦊 Elysia is running at ${server.hostname}:${server.port}`);
    await Promise.all([sql.authenticate()]);
  });
}
main();
