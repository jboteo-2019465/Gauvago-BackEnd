import { Router } from "express";
import { deleteC, obtener, registerC, searchC, updateC } from "./category.controller.js";
import { isAdmin, validateJwt } from "../middleware/validate-jwt.js";

const api = Router();


api.get('/obtener', obtener)
api.post('/searchC', searchC)


//Solo el administrador
api.post('/registerC',[isAdmin, validateJwt], registerC)
api.put('/updateC/:id',[isAdmin, validateJwt], updateC)
api.delete('/deleteC/:id', [isAdmin,validateJwt], deleteC)
export default api