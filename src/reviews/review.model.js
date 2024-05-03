'use strict'

import { Schema, model } from "mongoose"

const reviewSchema = Schema({
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        minLength: 1,
        maxLength: 5,
        enum: [1, 2, 3, 4, 5],
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    },
    userR: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    hotelR: {
        type: Schema.Types.ObjectId,
        ref: 'hotel'
        
    }
},{
    versionKey: false
})

export default model('review', reviewSchema)