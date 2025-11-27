import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
  FREELANCER = 'freelancer',
  ORGANIZER = 'organizer',
  GUEST = 'guest',
}

export enum AuthProvider {
  CREDENTIALS = 'credentials',
  GOOGLE = 'google',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, maxlength: 50 })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ select: false, minlength: 6 })
  password?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop({ default: false })
  isOAuthUser: boolean;

  @Prop({ type: String, enum: AuthProvider, default: AuthProvider.CREDENTIALS })
  provider: AuthProvider;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }] })
  purchasedCourses: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'OrganizationMembership' }] })
  organizationMemberships: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Organization', default: null })
  lastActiveOrganization: Types.ObjectId;

  @Prop({ trim: true })
  imageProfileUrl?: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  twoFactorEnabled: boolean;

  // Methods
  async matchPassword(enteredPassword: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook for password hashing
UserSchema.pre('save', async function (next) {
  const user = this as any;
  if (!user.isModified('password') || !user.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Register method
UserSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ provider: 1 });
