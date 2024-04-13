'use strict'

import { Schema, model } from "mongoose";

const departmentSchema = Schema({
    nameDepartment:{
        type:String,
        required:true
    }
},{
    versionKey: false
})

export default model('department', departmentSchema)