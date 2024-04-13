'use strict'

import Evevt from './event.model.js'
import { checkUpdate } from '../utils/validator'

//Registro de un evento
export const registroE = async(req, res)=>{
    try {
        let data = req.body
        
        const existingEvent = await Evevt.findOne({user: data.user})
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error registering the event'})
        
    }
}