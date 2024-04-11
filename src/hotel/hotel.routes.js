import { Router } from "express";
import { deleteH, obtener, registerH, searchH, test, updateH } from "./hotel.comtroller.js";

const api = Router();

api.get('/test', test)
api.post('/registerH', registerH)
api.get('/obtener', obtener)
api.put('/updateH/:id', updateH)
api.delete('/deleteH/:id', deleteH)
api.post('/searchH', searchH)

export default api
