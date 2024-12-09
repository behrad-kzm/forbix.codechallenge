import { User } from '../../../user/entities';

export class UserResponseDto {
  id: string;

  name: string;

  email: string;

  constructor(rawValue: User) {
    this.id = rawValue.id;
    this.name = rawValue.name;
    this.email = rawValue.email;
  }
}
