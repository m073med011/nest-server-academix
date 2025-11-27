import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TermDocument = HydratedDocument<Term>;

@Schema({ timestamps: true })
export class Term {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ maxlength: 500 })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Level', required: true })
  levelId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const TermSchema = SchemaFactory.createForClass(Term);

TermSchema.index({ levelId: 1 });
TermSchema.index({ organizationId: 1 });
TermSchema.index({ levelId: 1, startDate: 1 });

TermSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    const err = new Error('End date must be after start date');
    return next(err);
  }
  next();
});

TermSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'termId',
});
