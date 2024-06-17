import { JWTPayloadSpec } from '@elysiajs/jwt';
import Elysia from 'elysia';

import { AUTH } from '@/constants/endpoint-tags.constant';
import { jwtLib } from '@/utils/jwt.util';
import { successJson } from '@/utils/response.util';

import { AuthService, authService } from '../services/auth.service';
import { authValidation } from '../validations/auth.validation';

export const newAuthController = (authService: AuthService) => {
  const app = new Elysia()
    .use(jwtLib())

    .post(
      'register',
      async (c) => {
        const result = await authService.register(c.body);
        return successJson(result);
      },
      {
        body: authValidation.registerDto,
        detail: {
          tags: [AUTH],
        },
      },
    )

    .post(
      'login',
      async (c) => {
        const user = await authService.login(c.body);

        const jwtPayload: Record<string, string> & JWTPayloadSpec = {
          sub: user.id.toString(),
        };
        const [accessToken, refreshToken] = await Promise.all([
          c.jwt.sign(jwtPayload),
          c.jwtRefresh.sign(jwtPayload),
        ]);
        const tokens = {
          tokenType: 'Bearer',
          accessToken,
          refreshToken,
        };

        return successJson(tokens);
      },
      {
        body: authValidation.loginDto,
        detail: {
          tags: [AUTH],
        },
      },
    );

  return app;
};

export const authController = newAuthController(authService);
