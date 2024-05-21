import { Schema, model } from "mongoose";

const categorySchema = Schema({
    nameCategory:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum: ['category', 'feature']
    }
},{
    versionKey: false
})

export default model('category', categorySchema)