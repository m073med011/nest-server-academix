import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { OrganizationsRepository } from './organizations.repository';
import {
  Organization,
  OrganizationSchema,
} from './schemas/organization.schema';
import {
  OrganizationRole,
  OrganizationRoleSchema,
} from './schemas/organization-role.schema';
import {
  OrganizationMembership,
  OrganizationMembershipSchema,
} from './schemas/organization-membership.schema';
import { OrganizationMembershipRepository } from './organization-membership.repository';

import { Term, TermSchema } from './schemas/term.schema';
import { TermRepository } from './term.repository';
import { OrganizationRoleRepository } from './organization-role.repository';
import { UsersModule } from '../users/users.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: OrganizationRole.name, schema: OrganizationRoleSchema },
      {
        name: OrganizationMembership.name,
        schema: OrganizationMembershipSchema,
      },
      { name: Term.name, schema: TermSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => CoursesModule),
  ],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    OrganizationsRepository,
    OrganizationMembershipRepository,
    OrganizationRoleRepository,
    TermRepository,
  ],
  exports: [
    OrganizationsService,
    OrganizationMembershipRepository,
    OrganizationRoleRepository,
    TermRepository,
  ],
})
export class OrganizationsModule {}
