import { compare, genSalt, hash } from "bcrypt";
import { Document, Model, Schema, model, models } from "mongoose"

interface UserDocument extends Document{
    email: string;
    name: string;
    password: string;
    role: 'adming' | 'user';
    avatar?: {url: string; id:string};
    verified: boolean
}

interface Method {
    comparePassword(password: string) : Promise<boolean>
}

const userSchema = new Schema<UserDocument, {}, Method>(
    {
        email: {type: String, require: true, unique: true},
        name: {type: String, require: true, trim: true},
        password: {type: String, require: true, },
        role: {type: String, enum: ['admin', 'user'], default: 'user' },
        avatar: {type: Object, url: String, id: String },
        verified: {type: Boolean, default: false}

    }, {
        timestamps: true
    }
)

userSchema.pre('save', async function(next){
    try{
        if(!this.isModified('password')) return next()
    const salt = await genSalt(10)
    this.password = await hash(this.password, salt);

    next()
    }catch (e) {
        throw e
    }
})


userSchema.methods.comparePassword = async function (password) {
    try {
        return await compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const UserModel = models.User || model('User', userSchema)

export default UserModel as Model<UserDocument, {}, Method>;