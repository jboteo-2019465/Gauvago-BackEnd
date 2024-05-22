'use strict'

import { Router } from "express"
import { validateJwt } from "../middleware/validate-jwt.js"
import { checkAvailability, printBill } from "./bill.controller.js"

const api = Router()

api.get("/print", [validateJwt], printBill)
api.get("/get", [validateJwt], checkAvailability)
export default api