'use strict'

//Importaciones
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import { config } from "dotenv"




const app = express()
    config();
    const port = process.env.PORT || 2622

    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(helmet())
    app.use(morgan('dev'))

    export const initServer = ()=>{
        app.listen(port)
        console.log(`Server HTTP running in port ${port}`)
    }