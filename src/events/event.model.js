import { Schema, model } from "mongoose";

const eventSchema = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    typeEvent:{
        type:String,
        required:true
    },
    room:{
        type: Schema.Types.ObjectId,
        ref: 'room',
        required: true
    },
    date:{
        type: String,
        required: true
    },
    startTime:{
        type: String,
        required: true
    },
    noGuests:{
        type: Number,
        required: true
    }
},{
    versionKey: false
})

export default model('event', eventSchema)