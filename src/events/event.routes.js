import express from "express";
import { deleteEvent, registroE, updateEvent, viewEvents, viewHotelEvents, viewMyEvents, viewUserEvents } from  './event.controller.js'
import {isAdmin, isAdmin_AdminHotel, isHotel, validateJwt } from '../middleware/validate-jwt.js'


const api = express.Router()

//Accesos publicos
api.post('/registerE', [validateJwt, isAdmin_AdminHotel],registroE)

//Accesos privados
api.get('/viewMyEvents', [ validateJwt, isHotel], viewMyEvents)
api.get('/viewEvents', viewEvents)
api.get('/viewUserEvents/:name', [validateJwt, isAdmin], viewUserEvents)
api.get('/viewHotelEvents/:name', [validateJwt, isAdmin_AdminHotel], viewHotelEvents)
api.put('/updateEvent', [validateJwt, isAdmin_AdminHotel], updateEvent)
api.delete('/deleteEvent', [validateJwt, isAdmin_AdminHotel], deleteEvent)

export default api;
