import Sequelize from 'sequelize';

import databaseConfig, { DatabaseConfig } from '@/config/database.config';
import { Comment, commentModel } from '@/models/comment.model';
import { Post, postModel } from '@/models/post.model';
import { User, userModel } from '@/models/user.model';

const env = Bun.env.NODE_ENV! || 'development';
const config = databaseConfig[env as keyof DatabaseConfig];

export const sequelize: Sequelize.Sequelize = config.url
  ? new Sequelize.Sequelize(config.url!, config)
  : new Sequelize.Sequelize(config.database!, config.username!, config.password, config);

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
  userModel(sequelize, Sequelize.DataTypes),
  postModel(sequelize, Sequelize.DataTypes),
  commentModel(sequelize, Sequelize.DataTypes),
);

export class Sql extends Models {
  readonly sequelize!: Sequelize.Sequelize;
  readonly Sequelize!: typeof Sequelize;

  constructor(models: Models, s: Sequelize.Sequelize, S: typeof Sequelize) {
    super(models.User, models.Post, models.Comment);
    this.sequelize = s;
    this.Sequelize = S;
    this.createAssociation(models);
  }

  private createAssociation(models: Models) {
    (Object.keys(models) as Array<keyof Models>).forEach((modelName) => {
      if (!!models[modelName].associate) {
        models[modelName].associate(models);
      }
    });
  }

  async authenticate() {
    const [_, err] = await sequelize
      .authenticate()
      .then(() => {
        console.log('SQL Connection has been established successfully.');
        return [null, null];
      })
      .catch((err: unknown) => {
        console.error('Unable to connect to the SQL database:', err);
        return [null, true];
      });

    if (err) {
      const sto = setTimeout(() => {
        this.authenticate();
        clearTimeout(sto);
      }, 10000);
    }
  }
}

export const sql = new Sql(models, sequelize, Sequelize);
