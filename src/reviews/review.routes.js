'use strict'

import { Router } from "express"
import {register, test} from "./review.controller.js"
import { validateJwt, } from "../middleware/validate-jwt.js"

// crear una nueva instancia de enrutador de express
const api = Router() 

// definir una ruta GET para el endpoint '/test'
api.get('/test', test)
api.post('/register', [validateJwt], register)

// exportar la instancia de enrutador como la exportación predeterminada
export default api