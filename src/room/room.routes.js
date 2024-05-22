import { Router } from "express";
import { deleteR, obtener, registerR, searchR, update, handleImageUpload } from "./room.controller.js";
import { isAdmin, validateJwt } from "../middleware/validate-jwt.js";

const api = Router();

api.post('/registerR', [validateJwt], registerR)
api.get('/obtener', obtener)
api.post('/searchR', searchR)
api.post('/imagenes/:id', handleImageUpload);
api.delete('/deleteR/:id',[validateJwt, isAdmin], deleteR)
api.post('/searchR', searchR)
api.put('/update/:id',[validateJwt, isAdmin], update)

export default api