import { Logger } from '@bogeychan/elysia-logger/src/types';
import Elysia from 'elysia';

import { USERS } from '@/constants/endpoint-tags.constant';
import { getJwtPayload, getUser } from '@/utils/jwt.util';
import { checkPaginationDefault } from '@/utils/pagination-query.util';
import { successJson } from '@/utils/response.util';

import { UserService, userService } from '../services/user.service';
import { userValidation } from '../validations/user.validation';

export const newUsersController = (userService: UserService) => {
  const app = new Elysia({ prefix: '/users' })
    .get(
      '/',
      async (c) => {
        const result = await userService.getUserList({
          limit: c.query.limit!,
          page: c.query.page!,
          route: c.request.url,
        });
        return successJson(result);
      },
      {
        beforeHandle(c) {
          checkPaginationDefault(c.query);
        },
        detail: {
          tags: [USERS],
        },
      },
    )

    .get(
      '/u/:userId',
      async (c) => {
        const result = await userService.getUser(c.params.userId);
        ((c as any).log as Logger).debug(result, `u/${c.params.userId}`, 'hahaha');
        return successJson(result);
      },
      {
        params: userValidation.userIdParam,
        detail: {
          tags: [USERS],
        },
      },
    )

    /** auth middleware */
    .resolve(async (c) => {
      const jwtPayload = await getJwtPayload(c);
      return { jwtPayload };
    })

    .get(
      '/me',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        return successJson(user);
      },
      {
        detail: {
          tags: [USERS],
        },
      },
    )

    .get(
      '/me/posts',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        const result = await userService.getMyPost(user.id);
        return successJson(result);
      },
      {
        detail: {
          tags: [USERS],
        },
      },
    )

    .get(
      '/me/comments',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        const result = await userService.getMyComments(user.id);
        return successJson(result);
      },
      {
        detail: {
          tags: [USERS],
        },
      },
    )

    .patch(
      '/me',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        await userService.updateUser(user.id, c.body);
        c.set.status = 204;
        return {};
      },
      {
        body: userValidation.updateProfileDto,
        detail: {
          tags: [USERS],
        },
      },
    );

  return app;
};

export const usersController = newUsersController(userService);
