import express from 'express'
import { login, registerAd, registerCl, registerHt, test, updateU, deleteU } from './user.controller.js'
import { isAdmin, isHotel, validateJwt } from '../middleware/validate-jwt.js'

const api =  express.Router()

//accesos publicos
api.get('/test', test)
api.post('/login', login)
api.post('/register', registerCl)

//accesos privados
api.put('/update', [validateJwt] , updateU)
api.delete('/delete', [validateJwt], deleteU )

//accesos adminhotel
api.post('/registetHt', [validateJwt, isHotel],registerHt)

//accesos admin
api.post('/registerAd',[validateJwt,isAdmin], registerAd)

export default api