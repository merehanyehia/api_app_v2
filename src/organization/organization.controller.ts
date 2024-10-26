import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrganizationDto } from './dto/organization.dto';
import { OrganizationService } from './organization.service';
import { Organization_membersDto } from './dto/organization_members.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleAuthorizationGuard } from '../guards/role-authorization.guard';

@Controller('organization')
@UseGuards(AuthGuard, RoleAuthorizationGuard)
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}
  @Post('/')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addOrg(@Req() req, @Res() res, @Body() body: OrganizationDto) {
    try {
      const organization =
        await this.organizationService.createOrganization(body);
      res.status(201).json({ organization_id: organization });
    } catch (err) {
      throw err;
    }
  }
  @Post('/:organizationId/invite')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async inviteUser(
    @Req() req,
    @Res() res,
    @Body() body: Organization_membersDto,
  ) {
    try {
      const organizationId = req.params.organizationId;

      const invitationResult =
        await this.organizationService.createUserInvitation(
          body,
          organizationId,
        );
      res.status(201).json(invitationResult);
    } catch (err) {
      throw err;
    }
  }
  @Get('/')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getOrgs(@Req() req, @Res() res) {
    try {
      const organizations =
        await this.organizationService.getAllOrganizations();
      res.status(200).json(organizations);
    } catch (err) {
      throw err;
    }
  }
  @Get('/:organizationId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getOneOrganization(@Req() req, @Res() res) {
    try {
      const organizationId = req.params.organizationId;
      const organizationData =
        await this.organizationService.getOneOrganization(organizationId);
      res.status(200).json(organizationData);
    } catch (err) {
      throw err;
    }
  }

  @Put('/:organizationId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateOrganization(
    @Req() req,
    @Res() res,
    @Body() data: OrganizationDto,
  ) {
    try {
      const organizationId = req.params.organizationId;
      const organizationData =
        await this.organizationService.updateOrganization(organizationId, data);
      res.status(200).json(organizationData);
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:organizationId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async deleterganization(@Req() req, @Res() res) {
    try {
      const organizationId = req.params.organizationId;
      const organizationData =
        await this.organizationService.deleteOrganization(organizationId);
      res.status(200).json(organizationData);
    } catch (err) {
      throw err;
    }
  }
}
