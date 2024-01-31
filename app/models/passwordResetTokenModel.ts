import mongoose, { Schema, model, Document, Model, models } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import { ObjectId } from 'mongodb';

// Interface for EmailVerificationToken
interface PasswordResetTokenDocument extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

// Schema definition
const PasswordResetTokenSchema = new Schema<
  PasswordResetTokenDocument,
  {},
  Methods
>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 60 * 60 * 24 },
});

PasswordResetTokenSchema.pre('save', async function (next) {
  if (!this.isModified('token')) return next();

  const salt = await genSalt(10);
  this.token = await hash(this.token, salt);

  next();
});

PasswordResetTokenSchema.methods.compareToken = async function (
  token: string
): Promise<boolean> {
  try {
    return await compare(token, this.token);
  } catch (error) {
    throw error;
  }
};

const PasswordResetTokenModel =
  models.PasswordResetToken ||
  mongoose.model('PasswordResetToken', PasswordResetTokenSchema);

export default PasswordResetTokenModel as Model<
  PasswordResetTokenDocument,
  {},
  Methods
>;
