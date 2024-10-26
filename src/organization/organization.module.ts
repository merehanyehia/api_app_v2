import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, organizationSchema } from './models/organization.model';
import {
  Organization_members,
  Organization_membersSchema,
} from './models/organization_members.model';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: organizationSchema },
      { name: Organization_members.name, schema: Organization_membersSchema },
    ]),
  ],
})
export class OrganizationModule {}
