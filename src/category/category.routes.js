import { Router } from "express";
import { obtener, registerC } from "./category.controller.js";

const api = Router();

api.post('/registerC', registerC)
api.get('/obtener', obtener)

export default api