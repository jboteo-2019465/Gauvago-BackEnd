import { Router } from "express";
import { deleteC, obtener, registerC, searchC, updateC } from "./category.controller.js";
import { isAdmin, validateJwt } from "../middleware/validate-jwt.js";

const api = Router();


api.get('/obtener', obtener)
api.post('/searchC', searchC)


//Solo el administrador
api.post('/registerC',[validateJwt, isAdmin], registerC)
api.put('/updateC/:id',[validateJwt, isAdmin], updateC)
api.delete('/deleteC/:id', [validateJwt, isAdmin], deleteC)
export default api