import { etag } from '@bogeychan/elysia-etag';
import bearer from '@elysiajs/bearer';
import cors from '@elysiajs/cors';
import { compression } from 'elysia-compression';
import { helmet } from 'elysia-helmet';
import { ip } from 'elysia-ip';
import { rateLimit } from 'elysia-rate-limit';

import { router } from './infrastructures/router';
import { authController } from './modules/controller/auth.controller';
import { commentController } from './modules/controller/comment.controller';
import { postController } from './modules/controller/post.controller';
import { usersController } from './modules/controller/user.controller';
import { jwtLib } from './utils/jwt.util';
import { logger } from './utils/logger.util';
export const newApp = () => {
  const app = router
    .use(logger())
    .use(compression())
    .use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: [`'self'`],
            styleSrc: [`'self'`, `'unsafe-inline'`],
            imgSrc: [`'self'`, 'data:', 'validator.swagger.io', '*.scalar.com'],
            scriptSrc: [`'self'`, `https: 'unsafe-inline' 'unsafe-eval'`],
          },
        },
      }),
    )
    .use(cors())
    .use(ip())
    .use(etag())
    .use(rateLimit())
    .use(bearer())
    .use(jwtLib())

    .get('/', async (c) => {
      const data = { message: 'Hello Elysia' };
      c.log.debug({ data }, 'message');
      return Response.json(data);
    })
    .group('', (r) => r.use(authController))
    .group('v1', (r) => r.use(usersController).use(postController).use(commentController));

  return app;
};

export const app = newApp();
export type App = typeof app;
