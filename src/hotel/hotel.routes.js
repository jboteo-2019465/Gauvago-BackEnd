import { Router } from "express";
import { addFeatures, deleteH, denyHotel, getHotelRequest, obtener,  registerHotel,  registerHotelRequest, searchH, test, updateH, obtenerHabitaciones, handleImageUpload } from "./hotel.controller.js";
import { isAdmin, isAdmin_AdminHotel, isHotel, validateJwt } from "../middleware/validate-jwt.js";

const api = Router();

api.get('/test', test)
api.post('/register',[validateJwt, isAdmin], registerHotel)
api.post('/request/register',validateJwt, registerHotelRequest)
api.get('/obtener', obtener)
api.post('/imagenes/:id', handleImageUpload);
api.post('/obtenerHabitaciones', obtenerHabitaciones)
api.put('/update/:id', [validateJwt, isHotel], updateH)
api.delete('/delete/:id', [validateJwt, isAdmin_AdminHotel], deleteH)
api.post('/search', searchH)
api.get('/request/view', [validateJwt, isAdmin], getHotelRequest)
api.delete('/request/delete', [validateJwt, isAdmin], denyHotel)
api.put('/add/tag', [validateJwt, isAdmin_AdminHotel], addFeatures)

export default api
