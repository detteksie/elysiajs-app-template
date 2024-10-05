import createHttpError from 'http-errors';

import { Sql, sql } from '@/infrastructures/sql';
import { IPaginationOptions } from '@/utils/paginate';
import { sequelizePaginate } from '@/utils/sequelize-paginate';

import { AddPostCommentDto, CreatePostDto, PublishPostDto, UpdatePostDto } from '../dto/post.dto';

export class PostService {
  constructor(private readonly sql: Sql) {}

  async createPost(authorId: number, createPostDto: CreatePostDto) {
    const { title, content } = createPostDto;
    const newPost = await this.sql.Post.create({ authorId, title, content });
    return newPost;
  }

  async getPostList(options: IPaginationOptions) {
    const posts = await sequelizePaginate(this.sql.Post, options, {
      where: { isPublished: true },
      order: [['id', 'DESC']],
    });
    return posts;
  }

  async getPost(postId: number) {
    const post = await this.sql.Post.findByPk(postId, {
      include: [
        {
          model: this.sql.User,
          as: 'author',
        },
      ],
    });
    if (!post?.isPublished) {
      throw createHttpError(404, 'Post not found');
    }
    return post;
  }

  async updatePost(authorId: number, postId: number, updatePostDto: UpdatePostDto) {
    const { title, content } = updatePostDto;
    const updatedPost = await this.sql.Post.update(
      { title, content },
      { where: { id: postId, authorId } },
    );
    return updatedPost;
  }

  async publishPost(authorId: number, postId: number, publishPostDto: PublishPostDto) {
    const { isPublished } = publishPostDto;
    const updatedPost = await this.sql.Post.update(
      { isPublished },
      { where: { id: postId, authorId } },
    );
    return updatedPost;
  }

  async deletePost(authorId: number, postId: number) {
    const deletedPost = await this.sql.Post.destroy({
      where: { id: postId, authorId },
    });
    return deletedPost;
  }

  async addPostComment(
    commentatorId: number,
    postId: number,
    addPostCommentDto: AddPostCommentDto,
  ) {
    const { content } = addPostCommentDto;
    const addedComment = await this.sql.Comment.create({
      commentatorId,
      postId,
      content,
    });
    return addedComment;
  }

  async getPostComments(postId: number) {
    const postComments = await this.sql.Comment.findAll({
      where: { postId, hidden: false },
      include: [
        {
          model: this.sql.User,
          attributes: ['name'],
        },
      ],
    });
    return postComments;
  }
}

export const postService = new PostService(sql);
