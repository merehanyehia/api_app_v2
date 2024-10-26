import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Organization {
  @Prop({ unique: [true, 'this name is already exists'] })
  name: string;
  @Prop()
  description: string;
}
export const organizationSchema = SchemaFactory.createForClass(Organization);
