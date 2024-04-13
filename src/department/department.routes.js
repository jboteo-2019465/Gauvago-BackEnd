import express from 'express'
import { deleteD, obtener, registerD, searchD, updateD } from './department.controller.js'

const api = express.Router();
api.post('/registerD', registerD)
api.get('/obtener', obtener)
api.put('/updateD/:id', updateD)
api.delete('/deleteD/:nameDepa', deleteD)
api.post('/searchD', searchD)

export default api