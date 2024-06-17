import Elysia from 'elysia';

import { COMMENTS } from '@/constants/endpoint-tags.constant';
import { getJwtPayload, getUser } from '@/utils/jwt.util';

import { CommentService, commentService } from '../services/comment.service';
import { commentValidation } from '../validations/comment.validation';

export const newCommentController = (commentService: CommentService) => {
  const app = new Elysia({ prefix: '/comments' })
    /** auth middleware */
    .resolve(async (c) => {
      const jwtPayload = await getJwtPayload(c);
      return { jwtPayload };
    })

    .patch(
      '/:commentId',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        await commentService.updateComment(user.id, c.params.commentId, c.body);
        c.set.status = 204;
        return null;
      },
      {
        params: commentValidation.commentIdParam,
        body: commentValidation.updateCommentDto,
        detail: {
          tags: [COMMENTS],
        },
      },
    )
    .patch(
      '/:commentId/hide',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        await commentService.hideComment(user.id, c.params.commentId, c.body);
        c.set.status = 204;
        return null;
      },
      {
        params: commentValidation.commentIdParam,
        body: commentValidation.hideCommentDto,
        detail: {
          tags: [COMMENTS],
        },
      },
    )
    .delete(
      '/:commentId',
      async (c) => {
        const user = await getUser(c.jwtPayload);
        await commentService.deleteComment(user.id, c.params.commentId);
        c.set.status = 204;
        return null;
      },
      {
        params: commentValidation.commentIdParam,
        detail: {
          tags: [COMMENTS],
        },
      },
    );

  return app;
};

export const commentController = newCommentController(commentService);
