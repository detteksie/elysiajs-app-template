import Sequelize from 'sequelize';

interface Options extends Sequelize.Options {
  url?: string;
}

export interface DatabaseConfig {
  development: Options;
  test: Options;
  production: Options;
}

const databaseConfig: DatabaseConfig = {
  development: {
    url: Bun.env.DATABASE_URL,
    dialect: 'postgres',
    logQueryParameters: true,
    benchmark: true,
  },
  test: {
    url: Bun.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: Bun.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    pool: {
      min: 1,
      max: 5,
    },
  },
};

export default databaseConfig;
