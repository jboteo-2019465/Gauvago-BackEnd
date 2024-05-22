import {
    Schema,
    model
} from "mongoose"

const hotelRequestSchema = Schema({

    nameHotel: {
        type: String,
        required: true
    },
    
    slogan:{
        type: String
    },

    description: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true,
        unique: true
    },

    phoneHotel: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true,
        unique: true
    },
    department:{
        type: Schema.Types.ObjectId,
        ref: 'department',
        required: true
    },

    email: {
        type: String,
        required: true
    },

    imageUrl: {
        type: [String],
        default: []
    },

    stars: {
        type: Number,
        minLength: 1,
        maxLength: 5,
        required: true,
        default: 5
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }

}, {
    versionKey: false
})

export default model('hotelRequest', hotelRequestSchema)