import { t } from 'elysia';

export class AuthValidation {
  registerDto = t.Object({
    email: t.String({ format: 'email' }),
    username: t.String({ maxLength: 255 }),
    password: t.String({ minLength: 8, maxLength: 64 }),
    name: t.String({ maxLength: 255 }),
    birthdate: t.Optional(t.Union([t.Date(), t.Null()])),
  });

  loginDto = t.Object(
    {
      userSession: t.String({ default: 'ssamsara98', maxLength: 255 }),
      password: t.String({ default: 'asdf1234', minLength: 8, maxLength: 64 }),
    },
    {
      description: 'Expected an username and password',
    },
  );
}

export const authValidation = new AuthValidation();
