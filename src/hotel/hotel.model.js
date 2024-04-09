import  { Schema, model} from "mongoose"

const hotelSchema = Schema({

    nameHotel:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    address:{
        type: String,
        required: true,
        unique: true
    },

    phoneHotel:{
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true,
        unique: true
    },

    email:{
        type: String,
        required: true
    },

    stars:{
        type: Number,
        enum:['1','2','3','4','5'],
        required: true
    }
    
},{
    versionKey: false
})

export default model('hotel', hotelSchema)