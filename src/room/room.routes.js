import { Router } from "express";
import { deleteR, obtener, registerR, searchR } from "./room.controller.js";

const api = Router();

api.post('/registerR', registerR)
api.get('/obtener', obtener)
api.delete('/deleteR/:id', deleteR)
api.post('/searchR', searchR)

export default api