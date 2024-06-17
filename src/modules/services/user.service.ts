import createHttpError from 'http-errors';

import { Sql, sql } from '@/infrastructures/sql';
import { IPaginationOptions, paginate } from '@/utils/sequelize-paginate';

import { UpdateUserDto } from '../dto/user.dto';

export class UserService {
  constructor(private sql: Sql) {}

  async getUserList(options: IPaginationOptions) {
    const result = await paginate(this.sql.User, options, { where: {} });
    return result;
  }

  async getUser(userId: number) {
    const user = await this.sql.User.findByPk(userId);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    return user;
  }

  async getMyPost(userId: number) {
    const user = await this.sql.User.findByPk(userId, {
      include: [
        {
          model: this.sql.Post,
        },
      ],
    });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    return user;
  }

  async getMyComments(userId: number) {
    const user = await this.sql.User.findByPk(userId, {
      include: [
        {
          model: this.sql.Comment,
        },
      ],
    });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    return user;
  }

  async updateUser(myUserId: number, UpdateUserDto: UpdateUserDto) {
    const { name, birthdate } = UpdateUserDto;
    const updatedProfile = await this.sql.User.update(
      { name, birthdate },
      {
        where: { id: myUserId },
        returning: true,
      },
    );
    return updatedProfile;
  }
}

export const userService = new UserService(sql);
