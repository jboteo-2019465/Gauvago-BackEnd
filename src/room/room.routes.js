import { Router } from "express";
import { deleteR, obtener, registerR, searchR, update } from "./room.controller.js";
import { isAdmin, validateJwt } from "../middleware/validate-jwt.js";

const api = Router();

api.post('/registerR', [isAdmin, validateJwt], registerR)
api.get('/obtener', obtener)
api.delete('/deleteR/:id',[isAdmin, validateJwt], deleteR)
api.post('/searchR', searchR)
api.put('/update/:id',[isAdmin, validateJwt ], update)

export default api