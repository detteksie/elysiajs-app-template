import Elysia from 'elysia';

import { POSTS } from '@/constants/endpoint-tags.constant';
import { getJwtPayload, getUser } from '@/utils/jwt.util';
import { checkPaginationDefault } from '@/utils/pagination-query.util';
import { successJson } from '@/utils/response.util';

import { PostService, postService } from '../services/post.service';
import { postValidation } from '../validations/post.validation';

export const newPostController = (postService: PostService) => {
  const app = new Elysia({ prefix: '/posts' })
    .get(
      '/',
      async (c) => {
        const result = await postService.getPostList({
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
          tags: [POSTS],
        },
      },
    )
    .get(
      '/p/:postId',
      async (c) => {
        const result = await postService.getPost(c.params.postId);
        return successJson(result);
      },
      {
        params: postValidation.postIdParam,
        detail: {
          tags: [POSTS],
        },
      },
    )
    .get(
      '/p/:postId/comments',
      async (c) => {
        const result = await postService.getPostComments(c.params.postId);
        return successJson(result);
      },
      {
        params: postValidation.postIdParam,
        detail: {
          tags: [POSTS],
        },
      },
    )

    /** auth middleware */
    .resolve(async (c) => {
      const jwtPayload = await getJwtPayload(c);
      return { jwtPayload };
    })

    .post(
      '/',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        const result = await postService.createPost(user.id, c.body);
        c.set.status = 201;
        return successJson(result);
      },
      {
        body: postValidation.createPostDto,
        detail: {
          tags: [POSTS],
        },
      },
    )
    .post(
      '/p/:postId/comments',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        const result = await postService.addPostComment(user.id, c.params.postId, c.body);
        c.set.status = 201;
        return successJson(result);
      },
      {
        params: postValidation.postIdParam,
        body: postValidation.addPostCommentDto,
        detail: {
          tags: [POSTS],
        },
      },
    )
    .patch(
      '/p/:postId',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        await postService.updatePost(user.id, c.params.postId, c.body);
        c.set.status = 204;
        return null;
      },
      {
        params: postValidation.postIdParam,
        body: postValidation.updatePostDto,
        detail: {
          tags: [POSTS],
        },
      },
    )
    .patch(
      '/p/:postId/publish',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        await postService.publishPost(user.id, c.params.postId, c.body);
        c.set.status = 204;
        return null;
      },
      {
        params: postValidation.postIdParam,
        body: postValidation.publishPostDto,
        detail: {
          tags: [POSTS],
        },
      },
    )
    .delete(
      '/p/:postId',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        await postService.deletePost(user.id, c.params.postId);
        c.set.status = 204;
        return null;
      },
      {
        params: postValidation.postIdParam,
        detail: {
          tags: [POSTS],
        },
      },
    );

  return app;
};

export const postController = newPostController(postService);
