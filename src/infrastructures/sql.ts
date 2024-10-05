import sequelize from 'sequelize';

import { Comment, commentModel } from '@/models/comment.model';
import { Post, postModel } from '@/models/post.model';
import { User, userModel } from '@/models/user.model';
import databaseConfig, { DatabaseConfig } from '@db/database.config';

const env = Bun.env.NODE_ENV! || 'development';
const config = databaseConfig[env as keyof DatabaseConfig];

export const sqlz: sequelize.Sequelize = config.url
  ? new sequelize.Sequelize(config.url satisfies string, config)
  : new sequelize.Sequelize(config.database!, config.username!, config.password, config);

export class Models {
  readonly User!: typeof User;
  readonly Post!: typeof Post;
  readonly Comment!: typeof Comment;

  constructor(user: typeof User, post: typeof Post, comment: typeof Comment) {
    this.User = user;
    this.Post = post;
    this.Comment = comment;
  }
}

export const models = new Models(
  userModel(sqlz, sequelize.DataTypes),
  postModel(sqlz, sequelize.DataTypes),
  commentModel(sqlz, sequelize.DataTypes),
);

export class Sql extends Models {
  readonly sequelize!: sequelize.Sequelize;
  readonly Sequelize!: typeof sequelize;

  constructor(models: Models, s: sequelize.Sequelize, S: typeof sequelize) {
    super(models.User, models.Post, models.Comment);
    this.sequelize = s;
    this.Sequelize = S;
    this.createAssociation(models);
  }

  private createAssociation(models: Models) {
    (Object.keys(models) as Array<keyof Models>).forEach((modelName) => {
      if (
        models[modelName].associate !== undefined &&
        typeof models[modelName].associate === 'function'
      ) {
        models[modelName].associate(models);
      }
    });
  }

  async authenticate() {
    const [, err] = await safewait(this.sequelize.authenticate());
    if (err && Bun.env.NODE_ENV! !== 'test') {
      console.error('Unable to connect to SQL database:', err.message);
      console.error(err);
      const sto = setTimeout(() => {
        this.authenticate();
        clearTimeout(sto);
      }, 10000);
      return;
    }
    console.log('SQL Connection has been established successfully.');
  }
}

export const sql = new Sql(models, sqlz, sequelize);
