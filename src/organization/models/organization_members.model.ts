import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Organization_members {
  @Prop()
  user_email: string;
  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  orgId: string;
  @Prop()
  name?: string;

  @Prop()
  access_level: string;
}
export const Organization_membersSchema =
  SchemaFactory.createForClass(Organization_members);
