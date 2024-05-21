import { Schema, model } from "mongoose"

const userSchema = Schema({
    
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        unique: true,
        lowercase: true,
        required: true
    }, 
    password:{
        type: String,
        minLength: [8, 'Password must be 8 characters'],
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        uppercase: true,
        enum: ['ADMIN', 'CLIENT','ADMINHOTEL'],
        required: true
    },
    profileImageUrl: {
        type: String 
    },
    features: [{
        category: {
            type: Schema.Types.ObjectId,
            ref: 'category',
            required: true
        }
    }]
})

export default model('user', userSchema)