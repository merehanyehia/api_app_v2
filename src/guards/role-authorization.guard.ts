import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { Organization } from '../organization/models/organization.model';
import { Organization_members } from '../organization/models/organization_members.model';

@Injectable()
export class RoleAuthorizationGuard implements CanActivate {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,

    @InjectModel(Organization_members.name)
    private Organization_membersModel: Model<Organization_members>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const members = await this.Organization_membersModel.findOne({
      user_email: request.decodedToken.email,
    });

    if (!members) {
      return true;
    } else {
      const organization = await this.organizationModel.findById(members.orgId);
      if (!organization) {
        return true;
      }

      if (members.access_level === 'readonly') {
        if (request.path !== `/organization/${members.orgId}`) {
          throw new ForbiddenException(
            'you are not allowed to access this route',
          );
        }
      } else {
        return true;
      }
    }
    return true;
  }
}
