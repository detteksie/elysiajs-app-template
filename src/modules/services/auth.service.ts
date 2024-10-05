import createHttpError from 'http-errors';

import { Sql, sql } from '@/infrastructures/sql';
import { comparePassword } from '@/utils/bcrypt.util';

import { LoginDto, RegisterDto } from '../dto/auth.dto';

export class AuthService {
  constructor(private readonly sql: Sql) {}

  private loginError() {
    throw createHttpError(400, 'Email or Password is invalid');
  }

  private async findEmailOrUsername(
    email: string,
    username: string,
    needPassword: boolean = false,
  ) {
    const user = await this.sql.User.findOne({
      where: { [this.sql.Sequelize.Op.or]: { email, username } },
      ...(needPassword ? { attributes: { include: ['password'] } } : {}),
    });
    return user;
  }

  async register(registerDto: RegisterDto) {
    const { email, username, password, name, birthdate } = registerDto;

    const foundUser = await this.findEmailOrUsername(email, username);
    if (foundUser) {
      throw createHttpError(409, 'Email and/or Username already exist');
    }

    const user = await this.sql.User.create({
      email,
      username,
      password,
      name,
      birthdate,
    });
    user.setDataValue('password', '');
    return user;
  }

  async login(loginDto: LoginDto) {
    const { userSession, password } = loginDto;

    const user = await this.findEmailOrUsername(userSession, userSession, true);
    if (!user) {
      throw this.loginError();
    }

    const passwordMatched = await comparePassword(password, user?.password);
    if (!passwordMatched) this.loginError();

    return user;
  }
}

export const authService = new AuthService(sql);
