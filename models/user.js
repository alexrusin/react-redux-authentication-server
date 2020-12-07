import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple'

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { 
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: String
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('NotFound')
    } 

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unauthorized')
    }

    return user
}

userSchema.methods.generateAuthToken = function () {
    const user = this
    const timestamp = new Date().getTime()
    const token = jwt.encode({
        sub: user.id.toString(),
        iat: timestamp
    }, process.env.APP_SECRET)

    return token;
    
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    // delete userObject.tokens

    return userObject
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const ModelClass = mongoose.model('user', userSchema)

export default ModelClass