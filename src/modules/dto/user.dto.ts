export class CreateUserDto {
  declare name: string;
  declare email: string;
  declare password: string;
  declare birthdate?: Date | null;
}

export class UpdateUserDto {
  declare name: string;
  declare birthdate?: Date | null;
}
