import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';

import { Models } from '@/infrastructures/sql';

import { Post } from './post.model';
import { User } from './user.model';

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<number>;
  declare commentatorId: number;
  declare postId: number;
  declare content: string;
  declare hidden: CreationOptional<boolean>;

  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;
  declare deletedAt?: Date | null;

  declare getCommentator: BelongsToGetAssociationMixin<User>;
  declare createCommentator: BelongsToCreateAssociationMixin<User>;
  declare setCommentator: BelongsToSetAssociationMixin<User, number>;
  declare commentator?: NonAttribute<User>;

  declare getPost: BelongsToGetAssociationMixin<Post>;
  declare createPost: BelongsToCreateAssociationMixin<Post>;
  declare setPost: BelongsToSetAssociationMixin<Post, number>;
  declare post?: NonAttribute<Post>;

  declare static associations: {
    commentator: Association<Comment, User>;
    post: Association<Comment, Post>;
  };

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: Models) {
    // define association here
    this.belongsTo(models.User, {
      foreignKey: 'commentatorId',
    });
    this.belongsTo(models.Post);
  }
}

export const commentModel = (sequelize: Sequelize, DT: typeof DataTypes) => {
  Comment.init(
    {
      id: {
        type: DT.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      postId: {
        type: DT.BIGINT,
        field: 'post_id',
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      commentatorId: {
        type: DT.BIGINT,
        field: 'commentator_id',
        defaultValue: null,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      content: {
        type: DT.TEXT,
        allowNull: false,
      },
      hidden: {
        type: DT.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'comment',
      underscored: true,
      paranoid: true,
    },
  );

  return Comment;
};
