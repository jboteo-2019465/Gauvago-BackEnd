'use strict'

import { Router } from "express"
import {obtener, register, searchRW, test} from "./review.controller.js"
import { validateJwt, } from "../middleware/validate-jwt.js"

// crear una nueva instancia de enrutador de express
const api = Router() 

// definir una ruta GET para el endpoint '/test'
api.get('/test', test)
api.post('/register', [validateJwt], register)
api.get('/obtener', obtener)
api.post('/search', searchRW)

// exportar la instancia de enrutador como la exportación predeterminada
export default api