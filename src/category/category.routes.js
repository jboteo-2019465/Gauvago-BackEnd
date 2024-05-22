import { Router } from "express";
import { deleteC, obtener, obtenerFeatures, registerC, searchC, searchF, updateC } from "./category.controller.js";
import { isAdmin, validateJwt } from "../middleware/validate-jwt.js";

const api = Router();


api.get('/obtener', obtener)
api.get('/obtener/features', obtenerFeatures)
api.post('/searchC', searchC)
api.post('/search/features', searchF)



//Solo el administrador
api.post('/registerC',[validateJwt, isAdmin], registerC)
api.put('/updateC/:id',[validateJwt, isAdmin], updateC)
api.delete('/deleteC/:id', [validateJwt, isAdmin], deleteC)
export default api