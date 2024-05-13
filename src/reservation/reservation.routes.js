'use strict'

import { Router } from "express"
import { addReserva, cancelReserva, editReserva } from "./reservation.controller.js"
import { validateJwt } from "../middleware/validate-jwt.js"

const api = Router()

api.post('/new', validateJwt, addReserva)
api.put('/edit/:id', editReserva)
api.delete('/delete/:id', cancelReserva)

export default api