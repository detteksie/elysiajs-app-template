import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';

import { Models } from '@/infrastructures/sql';

import { Comment } from './comment.model';
import { User } from './user.model';

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare authorId: number | null;
  declare title: string;
  declare content: string;
  declare isPublished: CreationOptional<boolean>;

  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;
  declare deletedAt?: Date | null;

  declare getAuthor: BelongsToGetAssociationMixin<User>;
  declare createAuthor: BelongsToCreateAssociationMixin<User>;
  declare setAuthor: BelongsToSetAssociationMixin<User, number>;
  // `author` is an eagerly-loaded association.
  // We tag it as `NonAttribute`
  declare author?: NonAttribute<User>;

  declare getComments: HasManyGetAssociationsMixin<Comment>;
  declare addComment: HasManyAddAssociationMixin<Comment, number>;
  declare addComments: HasManyAddAssociationsMixin<Comment, number>;
  declare setComments: HasManySetAssociationsMixin<Comment, number>;
  declare removeComment: HasManyRemoveAssociationMixin<Comment, number>;
  declare removeComments: HasManyRemoveAssociationsMixin<Comment, number>;
  declare hasComment: HasManyHasAssociationMixin<Comment, number>;
  declare hasComments: HasManyHasAssociationsMixin<Comment, number>;
  declare countComments: HasManyCountAssociationsMixin;
  declare createComment: HasManyCreateAssociationMixin<Comment, 'commentatorId'>;
  declare comments?: NonAttribute<Comment[]>;

  declare static associations: {
    author: Association<Post, User>;
    comments: Association<Post, Comment>;
  };

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: Models) {
    // define association here
    this.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author',
    });
    this.hasMany(models.Comment);
  }
}

export const postModel = (sequelize: Sequelize, DT: typeof DataTypes) => {
  Post.init(
    {
      id: {
        type: DT.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      authorId: {
        type: DT.BIGINT,
        field: 'author_id',
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        validate: {
          isInt: true,
        },
      },
      title: {
        type: DT.STRING,
        allowNull: false,
      },
      content: {
        type: DT.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      isPublished: {
        type: DT.BOOLEAN,
        field: 'is_published',
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'post',
      underscored: true,
      paranoid: true,
    },
  );

  return Post;
};
