import { logger as elogger } from '@bogeychan/elysia-logger';
import Elysia from 'elysia';

import { logysia } from './logysia';
export const logger = () =>
  new Elysia({ name: 'utils/logger' })
    .use(elogger({ level: Bun.env.NODE_ENV === 'production' ? 'error' : 'trace' }))
    .use(logysia());
