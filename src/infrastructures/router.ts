import { swagger } from '@elysiajs/swagger';
import Elysia from 'elysia';

export const router = new Elysia().use(
  swagger({
    documentation: {
      info: {
        title: 'Elysia App Template Documentation',
        version: '1.0.0',
      },
    },
  }),
);
