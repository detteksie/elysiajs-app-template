import jwt, { JWTPayloadSpec } from '@elysiajs/jwt';
import Elysia, { Context, RouteSchema, SingletonBase, TSchema, UnwrapSchema } from 'elysia';
import createHttpError from 'http-errors';

import { sql } from '@/infrastructures/sql';

export const jwtLib = () =>
  new Elysia({ name: 'utils/jwt' })
    .use(
      jwt({
        secret: Bun.env.JWT_ACCESS_SECRET!,
        exp: Bun.env.NODE_ENV === 'production' ? '1d' : '1h',
      }),
    )
    .use(
      jwt({
        name: 'jwtRefresh',
        secret: Bun.env.JWT_REFRESH_SECRET!,
        exp: Bun.env.NODE_ENV === 'production' ? '30d' : '1d',
      }),
    );

type ContextJwt = Context<
  RouteSchema,
  SingletonBase & {
    decorator: {
      bearer: string | undefined;
      jwt: {
        verify: (
          jwt?: string,
        ) => Promise<
          | false
          | (UnwrapSchema<TSchema | undefined, Record<string, string | number>> & JWTPayloadSpec)
        >;
      };
      jwtRefresh: {
        verify: (
          jwt?: string,
        ) => Promise<
          | false
          | (UnwrapSchema<TSchema | undefined, Record<string, string | number>> & JWTPayloadSpec)
        >;
      };
    };
  }
>;

export const checkBearer = <C extends Context<RouteSchema>>(context: C) => {
  const c = context as ContextJwt;

  if (!c.bearer) {
    c.set.status = 401;
    c.set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;
    c.set.headers['Content-Type'] = `application/json`;
    throw createHttpError(401, 'Bearer is empty');
  }
};

export async function getJwtPayload<C extends Context<RouteSchema>>(
  context: C,
  tokenType: 'access' | 'refresh' = 'access',
) {
  const c = context as ContextJwt;
  checkBearer(c);

  const payload = await (tokenType === 'refresh'
    ? c.jwtRefresh.verify(c.bearer)
    : c.jwt.verify(c.bearer));

  if (payload === false) throw createHttpError(401, 'Bearer is invalid');

  return payload;
}

export async function getUser(jwtPayload: JWTPayloadSpec) {
  const user = await sql.User.findByPk(jwtPayload.sub!);
  if (!user) throw createHttpError(401, 'User not found');
  return user;
}
