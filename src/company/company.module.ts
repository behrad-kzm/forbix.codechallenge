import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company, UserCompany } from './entities';
import { CompanyService, UserCompanyService } from './services';
import { CompanyController, UserCompanyController } from './controllers';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, UserCompany]),
    forwardRef(() => UserModule),
  ],
  providers: [CompanyService, UserCompanyService],
  controllers: [CompanyController, UserCompanyController],
})
export class CompanyModule {}
