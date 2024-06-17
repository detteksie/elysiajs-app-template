import { t } from 'elysia';

export class CommentValidation {
  commentIdParam = t.Object({
    commentId: t.Numeric({ default: 0 }),
  });

  updateCommentDto = t.Object({
    content: t.Optional(t.String()),
  });

  hideCommentDto = t.Object({
    hidden: t.Optional(t.Boolean()),
  });
}

export const commentValidation = new CommentValidation();
