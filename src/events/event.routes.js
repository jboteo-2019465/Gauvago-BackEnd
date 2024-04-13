import express from "express";
import { deleteEvent, registroE, updateEvent, viewEvents, viewHotelEvents, viewMyEvents, viewUserEvents } from  './event.controller.js'
import {validateJwt } from '../middleware/validate-jwt.js'


const api = express.Router()

//Accesos publicos
api.post('/registerE', registroE)

//Accesos privados
api.get('/viewMyEvents', validateJwt, viewMyEvents)
api.get('/viewEvents', validateJwt, viewEvents)
api.get('/viewUserEvents/:name', validateJwt, viewUserEvents)
api.get('/viewHotelEvents/:name', validateJwt, viewHotelEvents)
api.put('/updateEvent', validateJwt, updateEvent)
api.delete('/deleteEvent', validateJwt, deleteEvent)

export default api;
