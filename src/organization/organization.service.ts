import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './models/organization.model';
import { Model } from 'mongoose';
import { OrganizationDto } from './dto/organization.dto';
import { Organization_membersDto } from './dto/organization_members.dto';
import { Organization_members } from './models/organization_members.model';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,

    @InjectModel(Organization_members.name)
    private Organization_membersModel: Model<Organization_members>,
  ) {}
  async createOrganization(orgData) {
    const { name, description } = orgData;

    const findOrg = await this.organizationModel.findOne({
      name: name,
    });

    if (findOrg !== null) {
      throw new BadRequestException('organization already exists');
    }
    const organization = await new this.organizationModel({
      name,
      description,
    }).save();
    return organization._id;
  }

  async getAllOrganizations() {
    const allOrgs = await this.organizationModel.find();
    if (allOrgs === null) {
      throw new NotFoundException('There are no organizations');
    }
    const members = await this.Organization_membersModel.find();

    const organizations = await this.organizationModel.find();
    const organizationsWithMembers = await Promise.all(
      organizations.map(async (org) => {
        const members = await this.Organization_membersModel.find({
          orgId: org._id,
        });

        return {
          organization_id: org._id,
          name: org.name,
          description: org.description,
          organization_members: members.map((member) => ({
            name: member.name,
            email: member.user_email,
            access_level: member.access_level,
          })),
        };
      }),
    );

    return organizationsWithMembers;
  }

  async getOneOrganization(organizationId: string) {
    const organization = await this.organizationModel.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    const members = await this.Organization_membersModel.find({
      orgId: organization._id,
    });

    return {
      organization_id: organization._id,
      name: organization.name,
      description: organization.description,
      organization_members: members.map((member) => ({
        name: member.name,
        email: member.user_email,
        access_level: member.access_level,
      })),
    };
  }

  async updateOrganization(
    organizationId: string,
    updatedData: OrganizationDto,
  ) {
    const organizationBeforeUpdate =
      await this.organizationModel.findById(organizationId);
    if (!organizationBeforeUpdate) {
      throw new NotFoundException('Organization not found');
    }

    if (updatedData.name) {
      await this.organizationModel.findByIdAndUpdate(organizationId, {
        $set: {
          name: updatedData.name,
        },
      });
    }
    if (updatedData.description) {
      await this.organizationModel.findByIdAndUpdate(organizationId, {
        $set: {
          description: updatedData.description,
        },
      });
    }
    const updatedOrganization =
      await this.organizationModel.findById(organizationId);
    return updatedOrganization;
  }

  async deleteOrganization(organizationId: string) {
    const organization = await this.organizationModel.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.Organization_membersModel.deleteMany({
      orgId: organization._id,
    });
    await this.organizationModel.findByIdAndDelete(organizationId);

    return 'organization and its members deleted successfully';
  }

  async createUserInvitation(
    userData: Organization_membersDto,
    organizationId: string,
  ) {
    const { user_email } = userData;

    const findOrg = await this.organizationModel.findOne({
      _id: organizationId,
    });

    if (findOrg === null) {
      throw new NotFoundException('organization does not exist');
    }

    const findMember = await this.Organization_membersModel.findOne({
      orgId: findOrg._id,
    });

    if (findMember !== null) {
      throw new BadRequestException(
        'this user already exists in the organization',
      );
    }
    await new this.Organization_membersModel({
      user_email: user_email,
      name: userData.name ? userData.name : user_email,
      orgId: findOrg._id,
      access_level: 'readonly',
    }).save();
    return `user invited to ${findOrg.name} successfully`;
  }
}
