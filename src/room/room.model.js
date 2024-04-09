import {  Schema, model } from "mongoose";

const hotelSchema = Schema({
    nameRoom:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    price:{
        type: Number,
        required: true
    },
    hotel:{
        type: Schema.Types.ObjectId,
        ref: 'hotel'
    }
},{
    versionKey: false
})

export default model('room', hotelSchema)