import express from "express";
import { deleteEvent, registroE, updateEvent, viewEvents, viewHotelEvents, viewMyEvents, viewUserEvents } from  './event.controller.js'
import {isAdmin, isAdmin_AdminHotel, isHotel, validateJwt } from '../middleware/validate-jwt.js'


const api = express.Router()

//Accesos publicos
api.post('/registerE', [isAdmin_AdminHotel, validateJwt],registroE)

//Accesos privados
api.get('/viewMyEvents', [isHotel, validateJwt], viewMyEvents)
api.get('/viewEvents', viewEvents)
api.get('/viewUserEvents/:name', [isAdmin,validateJwt], viewUserEvents)
api.get('/viewHotelEvents/:name', [isAdmin_AdminHotel,validateJwt], viewHotelEvents)
api.put('/updateEvent', [isAdmin_AdminHotel,validateJwt], updateEvent)
api.delete('/deleteEvent', [isAdmin_AdminHotel,validateJwt], deleteEvent)

export default api;
