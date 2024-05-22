'use strict'

import { Router } from "express"
import { validateJwt } from "../middleware/validate-jwt.js"
import { printBill } from "./bill.controller.js"

const api = Router()

api.get("/print", [validateJwt], printBill)
export default api