import { Company } from '../../../company/entities';

export class CompanyResponseDto {
  id: string;
  name: string;

  constructor(company: Company) {
    this.id = company.id;
    this.name = company.name;
  }
}
