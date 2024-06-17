/**
 * @typedef {({url?: string} & import("sequelize").Options)} Options
 */
/**
 * @typedef DatabaseConfig
 * @type {Object}
 * @property {Options} development
 * @property {Options} test
 * @property {Options} production
 */

/**
 * @type {DatabaseConfig}
 */
const databaseConfig = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logQueryParameters: true,
    benchmark: true,
    migrationStorageTableName: 'sequelize_meta',
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    migrationStorageTableName: 'sequelize_meta',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    migrationStorageTableName: 'sequelize_meta',
    pool: {
      min: 1,
      max: 5,
    },
  },
};

module.exports = databaseConfig;
