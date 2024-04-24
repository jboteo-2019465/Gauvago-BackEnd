'use strict'
import Review from "./review.model.js"

export const test = (req, res) =>{
    console.log('test panoli')
    return res.send({message: 'test'})
}