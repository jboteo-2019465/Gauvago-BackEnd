import { Router } from "express";
import { deleteC, obtener, registerC, searchC, updateC } from "./category.controller.js";

const api = Router();

api.post('/registerC', registerC)
api.get('/obtener', obtener)
api.put('/updateC/:id', updateC)
api.delete('/deleteC/:id', deleteC)
api.post('/searchC', searchC)

export default api