'use strict'

//Importaciones
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { config } from "dotenv"
import hotelRoutes from '../src/hotel/hotel.routes.js'
import roomRoutes from '../src/room/room.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import userRoutes from '../src/user/user.routes.js'

const app = express()
    config();
    const port = process.env.PORT || 2622

    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(cors())

    //Declaracion de rutas
     app.use('/hotel', hotelRoutes)
     app.use('/room', roomRoutes)
     app.use('/category', categoryRoutes)
     app.use('/user', userRoutes)

    export const initServer = ()=>{
        app.listen(port)
        console.log(`Server HTTP running in port ${port}`)
    }