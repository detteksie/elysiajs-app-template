import Sequelize from 'sequelize';
interface Options extends Sequelize.Options {
  url?: string;
}
export interface DatabaseConfig {
  development: Options;
  test: Options;
  production: Options;
}
declare const databaseConfig: DatabaseConfig;
export default databaseConfig;
