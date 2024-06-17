import { t } from 'elysia';

export class PostValidation {
  postIdParam = t.Object({
    postId: t.Numeric({ default: 0 }),
  });

  createPostDto = t.Object({
    title: t.String({ maxLength: 255 }),
    content: t.String(),
  });

  updatePostDto = t.Object({
    title: t.Optional(t.String({ maxLength: 255 })),
    content: t.Optional(t.String()),
  });

  publishPostDto = t.Object({
    isPublished: t.Optional(t.Boolean()),
  });

  addPostCommentDto = t.Object({
    content: t.String(),
  });
}

export const postValidation = new PostValidation();
