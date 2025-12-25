import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Organization } from '../../organizations/schemas/organization.schema';

export type LevelDocument = Level & Document;

@Schema({ timestamps: true })
export class Level {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ maxlength: 500 })
  description: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organizationId: Organization;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Term' }] })
  terms: MongooseSchema.Types.ObjectId[];
}

export const LevelSchema = SchemaFactory.createForClass(Level);

// Indexes
LevelSchema.index({ organizationId: 1, order: 1 });
LevelSchema.index({ organizationId: 1, name: 1 }, { unique: true });

// Virtuals
LevelSchema.virtual('students', {
  ref: 'OrganizationMembership',
  localField: '_id',
  foreignField: 'levelId',
  match: { status: 'active' },
});
