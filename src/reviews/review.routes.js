'use strict'

import { Router } from "express"
import {test} from "./review.controller.js"

// crear una nueva instancia de enrutador de express
const api = Router() 

// definir una ruta GET para el endpoint '/test'
api.get('/test', test)

// exportar la instancia de enrutador como la exportación predeterminada
export default api