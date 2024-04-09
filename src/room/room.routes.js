import { Router } from "express";
import { deleteR, obtener, registerR } from "./room.controller.js";

const api = Router();

api.post('/registerR', registerR)
api.get('/obtener', obtener)
api.delete('/deleteR/:id', deleteR)

export default api