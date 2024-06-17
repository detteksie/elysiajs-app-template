export class CreatePostDto {
  declare title: string;
  declare content: string;
}

export class UpdatePostDto {
  declare title?: string;
  declare content?: string;
}

export class PublishPostDto {
  declare isPublished?: boolean;
}

export class AddPostCommentDto {
  declare content: string;
}
