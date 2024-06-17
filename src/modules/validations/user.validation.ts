import { t } from 'elysia';

export class UserValidation {
  userIdParam = t.Object({
    userId: t.Numeric({ default: 0 }),
  });

  createUserDto = t.Object({
    name: t.String({ maxLength: 255 }),
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8, maxLength: 64 }),
    birthdate: t.Optional(t.Union([t.Date(), t.Null()])),
  });

  updateProfileDto = t.Object({
    name: t.String(),
    birthdate: t.Optional(t.Union([t.Date(), t.Null()])),
  });
}

export const userValidation = new UserValidation();
