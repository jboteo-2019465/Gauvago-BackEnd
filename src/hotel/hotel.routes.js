import { Router } from "express";
import { obtener, registerH, test } from "./hotel.comtroller.js";

const api = Router();

api.get('/test', test)
api.post('/registerH', registerH)
api.get('/obtener', obtener)

export default api
