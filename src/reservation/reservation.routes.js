'use strict'

import { Router } from "express"
import { addReserva, cancelReserva, editReserva } from "./reservation.controller.js"

const api = Router()

api.post('/new', addReserva)
api.put('/edit/:id', editReserva)
api.delete('/delete/:id', cancelReserva)

export default api