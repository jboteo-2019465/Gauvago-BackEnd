import express from 'express'
import { login, registerAd, registerCl, registerHt, test } from './user.controller.js'
import { isAdmin, isHotel, validateJwt } from '../middleware/validate-jwt.js'

const api =  express.Router()

//accesos publicos
api.get('/test', test)
api.post('/login', login)
api.post('/register', registerCl)

//accesos adminhotel
api.post('/registetHt', [validateJwt, isHotel],registerHt)

//accesos admin
api.post('/registerAd',[validateJwt,isAdmin], registerAd)

export default api