import { Router } from "express";
import { deleteH, getHotelRequest, obtener,  registerHotel,  registerHotelRequest, searchH, test, updateH } from "./hotel.controller.js";
import { isAdmin_AdminHotel, isHotel, validateJwt } from "../middleware/validate-jwt.js";

const api = Router();

api.get('/test', test)
api.post('/register', registerHotel)
api.post('/request/register', registerHotelRequest)
api.get('/obtener', obtener)
api.put('/update/:id', [isHotel, validateJwt], updateH)
api.delete('/delete/:id', [isAdmin_AdminHotel, validateJwt], deleteH)
api.post('/search', searchH)
api.get('/request/view', getHotelRequest)

export default api
