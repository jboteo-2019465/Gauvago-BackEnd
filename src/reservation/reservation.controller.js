'use strict'
import { checkUpdateReserva } from '../utils/validator.js'
import Reser from './reservation.model.js'
import Room from '../room/room.model.js'

// Agregar reservacion
export const addReserva = async (req, res) => {
    try {
        let data = req.body
        let user = req.user
        data.client = user._id

        // Verifica si la habitacion esta disponible
        let room = await Room.findOne({ _id: data.room, available: 'DISPONIBLE' })
        if (!room) return res.status(404).send({ message: 'Room not found or not available' })

        // Verifica si otro cliente está intentando reservar la misma habitación para la misma fecha
        const otherClientReservation = await Reser.findOne({
            room,
            entryDate: { $gte: new Date(data.entryDate) },
            client: { $ne: data.client } // Excluir la reserva del cliente actual
        })

        // Verifica que la fecha de vencimiento no sea anterior a la fecha de reserva
        if (new Date(data.departureDate) < new Date(data.entryDate)) {
            return res.status(400).json({ message: 'Expiration date cannot be before reservation date' })
        }

        // Cambiar la disponibilidad de la habitacion
        room.available = 'NODISPONIBLE'
        // Hace la reservacion

        let departureDate = new Date(data.departureDate)
        let entryDate = new Date(data.entryDate)
        let diferencia = departureDate.getTime() - entryDate.getTime();
        let diferenciaEnDias = diferencia / 1000 / 60 / 60 / 24;
        data.total = (diferenciaEnDias * room.price)
        console.log(data.total)
        let newReserva = new Reser(data)
        await newReserva.save()
        await room.save()

        return res.status(200).send({ message: 'Reservation added successfully', newReserva })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error when adding the reservation', err: err })
    }
}

//Editar reservacion
export const editReserva = async (req, res) => {
    try {
        let data = req.body
        let room = await Room.findOne({ _id: data.room })
        let { id } = req.params
        let update = checkUpdateReserva(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let departureDate = new Date(data.departureDate)
        let entryDate = new Date(data.entryDate)
        let diferencia = departureDate.getTime() - entryDate.getTime();
        let diferenciaEnDias = diferencia / 1000 / 60 / 60 / 24;
        data.total = (diferenciaEnDias * room.price)
        let updateReserva = await Reser.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateReserva) return res.status(404).send({ message: 'Reservation not found and not upadate' })
        return res.status(200).send({ message: 'Reservation edited successfully', updateReserva });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error when editing the reservation', err: err });
    }
}

//Cancelar reservacion (delete)
export const cancelReserva = async (req, res) => {
    try {
        let { id } = req.params
        let cancelReserva = await CSSMathProduct.findOneAndDelete({ _id: id })
        if (!cancelReserva) return res.status(404).send({ message: 'Reservation not found and not deleted' })
        return res.status(200).send({ message: 'Reservation deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error canceling the reservation' })
    }
}


