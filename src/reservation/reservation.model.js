import {Schema, model} from "mongoose"

const reservationSchema = Schema({
    client: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    room:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'room'
    },
    entryDate: {
        type: Date,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    total:{
        type: Number,
        required: true
    }
})    

export default model('reservation', reservationSchema)