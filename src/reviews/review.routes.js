'use strict'

import { Router } from "express"
import {deleteRw, obtener, register, searchRW, test, updateR} from "./review.controller.js"
import { validateJwt, } from "../middleware/validate-jwt.js"

// crear una nueva instancia de enrutador de express
const api = Router() 

// definir una ruta GET para el endpoint '/test'
api.get('/test', test)
api.post('/register', [validateJwt], register)
api.get('/obtener', obtener)
api.post('/search', searchRW)
api.delete('/delete/:id',[validateJwt], deleteRw)
api.put('/updateR/:id',[validateJwt], updateR)

// exportar la instancia de enrutador como la exportación predeterminada
export default api