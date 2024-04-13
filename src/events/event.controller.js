'use strict'

import Event from './event.model.js'
import User from '../user/user.model.js'
import Hotel from '../hotel/hotel.model.js'


import jwt from 'jsonwebtoken'
import { checkUpdate } from '../utils/validator'

//Registro de un evento
export const registroE = async(req, res)=>{
    try {
        let data = req.body
        let { authorization } = req.headers
        let secretKey = process.env.SECRET_KEY
        let {uid} = jwt.verify(authorization, secretKey)//extrae el id del usuario del token

        const userWithEvent = await Event.findOne({user: uid})//Verifica si el usuario ya tiene un evento
        if(userWithEvent){
            return res.status(400).send({message: 'You already have an event'})
        }
        data.user = uid//Guarda el id del usuario en el evento
        let event = new Event(data)
        await event.save()
        return res.send({message: 'Your event has been registered!!, enjoy it'})
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error registering the event'})
        
    }
}

//Ver los eventos del usuario
export const viewMyEvents = async(req, res)=>{
    try {
        let secretKey = process.env.SECRET_KEY
        let {authorization} = req.headers
        let {uid} = jwt.verify(authorization, secretKey)
        let events = await Event.find({user: uid})//Busca un evento con el id del usuario
        return res.send({events})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching for your events'})
        
    }
}

//Ver todos los eventos
export const viewEvents = async(req,res)=>{
    try {
        let data = await Event.find()
        return res.send(data)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching events'})
        
    }
}

//Ver los eventos de un usuario
export const viewUserEvents = async(req, res)=>{
    try {
        let { name } = req.params;
        let user = await User.findOne({ name });//Busca el usuario en la base de datos
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
        let events = await Event.find({ user: user._id });//Busca al usuario en eventos por medio del id
        if(!events){return res.status(404).send({message: 'This User has no events'})}

        res.send({ events });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error searching for your events' });
      }
}

//Ver los eventos de un hotel
export const viewHotelEvents = async(req, res)=>{
    try {
        let { name } = req.params;
        let hotel = await Hotel.findOne({ name });//Busca el hotel en la base de datos
        if (!hotel) {
          return res.status(404).send({ message: 'Hotel not found' });
        }
        let events = await Event.find({ hotel: hotel._id });//Busca al hotel en eventos por medio del id
        if(!events){return res.status(404).send({message: 'This hotel has no events'})}
        res.send({ events });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error searching for your events' });
      }
}


//Actualizar evento
export const updateEvent = async (req, res) => {
    try {
      let { id } = req.params;
      let { authorization } = req.headers;
      let secretKey = process.env.SECRET_KEY;
      let { uid, role } = jwt.verify(authorization, secretKey);
      let event = await Event.findById(id);
      if (role!== 'ADMIN' && event.user.toString()!== uid) {
        return res.status(403).send({ message: 'Forbidden' });
      }
      let updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
      res.send({ message: 'Event updated successfully', updatedEvent });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error updating event' });
    }
  };


//Eliminar evento
export const deleteEvent = async (req, res) => {
    try {
      let { id } = req.params;
      let { authorization } = req.headers;
      let secretKey = process.env.SECRET_KEY;
      let { uid, role } = jwt.verify(authorization, secretKey);
      let event = await Event.findById(id);
      if (role!== 'ADMIN' && event.user.toString()!== uid) {
        return res.status(403).send({ message: 'Forbidden' });
      }
      await Event.findByIdAndDelete(id);
      res.send({ message: 'Event deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error deleting event' });
    }
  };