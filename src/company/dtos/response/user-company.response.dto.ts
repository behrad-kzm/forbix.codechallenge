import { UserCompany } from '../../../company/entities';

export class UserCompanyResponseDto {
  id: string;

  companyId: string;

  userId: string;

  constructor(rawValue: UserCompany) {
    this.id = rawValue.id;
    this.companyId = rawValue.companyId;
    this.userId = rawValue.userId;
  }
}
