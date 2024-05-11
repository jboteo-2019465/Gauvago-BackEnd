'use strict'
import { checkUpdateReserva } from '../utils/validator.js'
import Reser from './reservation.model.js'
import Room from '../room/room.model.js'

//reservacion


//Editar reservacion
export const editReserva = async(req, res) =>{
    try {
        let data = req.body
        let {id} = req.params
        let update = checkUpdateReserva(data,id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updateReserva = await Reser.findOneUpdate(
            {_id: id},
             data,
            {new: true}
        )
        if(!updateReserva) return res.status(404).send({message: 'Reservation not found and not upadate' })
        return res.status(200).send({ message: 'Reservation edited successfully', updateReserva });
    } catch (err) {
        return res.status(500).send({ message: 'Error when editing the reservation', err: err });
    }
}

//Cancelar reservacion (delete)
export const cancelReserva = async (req, res) => {
    try {
        let { id } = req.params
        let cancelReserva = await CSSMathProduct.findOneAndDelete({_id: id})
        if(!cancelReserva) return res.status(404).send({message: 'Reservation not found and not deleted'})
        return res.status(200).send({message: 'Reservation deleted successfully'})
    }catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error canceling the reservation'})
    }    
}

