import { Router } from "express";
import { deleteH, obtener, registerH, searchH, test, updateH } from "./hotel.controller.js";

const api = Router();

api.get('/test', test)
api.post('/register', registerH)
api.get('/obtener', obtener)
api.put('/update/:id', updateH)
api.delete('/delete/:id', deleteH)
api.post('/search', searchH)

export default api
