import {
  Association,
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
import { hashPassword } from '@/utils/bcrypt.util';

import { Comment } from './comment.model';
import { Post } from './post.model';

export class User extends Model<
  InferAttributes<User, { omit: 'posts' | 'comments' }>,
  InferCreationAttributes<User, { omit: 'posts' | 'comments' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare email: string;
  declare username: string;
  declare password: string;
  declare name: string;
  declare sexType: 'Unknown' | 'Male' | 'Female' | null;
  declare birthdate: Date | null;

  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt?: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt?: CreationOptional<Date>;

  declare deletedAt?: Date | null;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getPosts: HasManyGetAssociationsMixin<Post>; // Note the null assertions!
  declare addPost: HasManyAddAssociationMixin<Post, number>;
  declare addPosts: HasManyAddAssociationsMixin<Post, number>;
  declare setPosts: HasManySetAssociationsMixin<Post, number>;
  declare removePost: HasManyRemoveAssociationMixin<Post, number>;
  declare removePosts: HasManyRemoveAssociationsMixin<Post, number>;
  declare hasPost: HasManyHasAssociationMixin<Post, number>;
  declare hasPosts: HasManyHasAssociationsMixin<Post, number>;
  declare countPosts: HasManyCountAssociationsMixin;
  declare createPost: HasManyCreateAssociationMixin<Post, 'authorId'>;
  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare posts?: NonAttribute<Post[]>; // Note this is optional since it's only populated when explicitly requested in code

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
    posts: Association<User, Post>;
    comments: Association<User, Comment>;
  };

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: Models) {
    // define association here
    this.hasMany(models.Post, {
      foreignKey: 'authorId',
    });
    this.hasMany(models.Comment, {
      foreignKey: 'commentatorId',
    });
  }
}

export const userModel = (sequelize: Sequelize, DT: typeof DataTypes) => {
  User.init(
    {
      id: {
        type: DT.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DT.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: 'Email is invalid' },
        },
      },
      username: {
        type: DT.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DT.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 64],
            msg: 'Password must be between 8 and 64 characters',
          },
        },
      },
      name: {
        type: DT.STRING,
        allowNull: false,
      },
      sexType: {
        type: DT.ENUM('Unknown', 'Male', 'Female'),
        defaultValue: 'Unknown',
      },
      birthdate: {
        type: DT.DATE,
        validate: {
          isDate: {
            args: true,
            msg: 'Date is invalid',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'user',
      underscored: true,
      paranoid: true,
      defaultScope: { attributes: { exclude: ['password'] } },
      hooks: {
        beforeCreate: async (doc) => {
          doc.password = await hashPassword(doc.password);
          return;
        },
      },
    },
  );

  return User;
};
