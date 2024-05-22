import Bill from '../reservation/reservation.model.js'
import User from '../user/user.model.js'
import Room from '../room/room.model.js'
import Hotel from '../hotel/hotel.model.js'

import pdf from 'pdfkit'
import fs from 'fs'
import path from 'path'

export const printBill = async (req, res) => {
    try {
        let uid = req.user._id
        let bill = await Bill.findOne(
            { client: uid }
        )
        console.log(bill)
        let user = await User.findById(uid)
        let room = await Room.findById(bill.room)
        let hotel = await Hotel.findById(room.hotel)
        console.log(hotel)

        if (!bill) {
            return res.status(401).send({ message: "No bill found!" })
        }

        //crear el pdf
        let print = new pdf()
        const filePath = path.resolve('bill.pdf')
        print.pipe(fs.createWriteStream(filePath))


        print.fontSize(20)
            .font('Helvetica-Bold')
            .text("Factura", { align: 'center' })
            .moveDown(0.5);

        print.fontSize(12)
            .font('Helvetica-Oblique')
            .text("____________________________________________________________________", { align: 'center' })
            .moveDown(1.5);

        // Información general
        print.font('Helvetica')
            .fontSize(12)
            .text(`Fecha de impresión: ${new Date().toLocaleString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })}`)
            .text(`Hora de impresión: ${new Date().toLocaleString('es-GT', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}`)
            .moveDown(1);

        print.font('Helvetica-Bold')
            .text(`Cliente: ${user.name}`)
            .moveDown(0.5);

        print.font('Helvetica-Oblique')
            .text("________________________")
            .moveDown(1.5);

        // Reservación
        print.font('Helvetica-Bold')
            .fontSize(14)
            .text('Reservación', { align: 'left' })
            .moveDown(0.5);

        print.fontSize(12)
            .font('Helvetica-Oblique')
            .text("_____________")
            .moveDown(1);

        print.font('Helvetica')
            .fontSize(12)
            .text(`Hotel: ${hotel.nameHotel}`)
            .text(`Cuarto: ${room.nameRoom}`)
            .text(`Precio del cuarto: Q.${room.price.toFixed(2)}`)
            .text(`Fecha de entrada: ${new Date(bill.entryDate).toLocaleString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })}`)
            .text(`Fecha de salida: ${new Date(bill.departureDate).toLocaleString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })}`)
            .moveDown(1);

        print.font('Helvetica-Bold')
            .text(`Total: Q.${bill.total.toFixed(2)}`, { align: 'right' })
            .moveDown(1.5);

        // Añadir una línea final
        print.font('Helvetica-Oblique')
            .text("____________________________________________________________________", { align: 'center' })
            .moveDown(1.5);

        // Añadir imagen en el pie de página
        const footerImagePath = path.resolve('./src/utils/logo/logos.png'); // Ruta de tu imagen
        const pageHeight = print.page.height;
        const pageWidth = print.page.width;
        const imageWidth = 100; // Ancho deseado de la imagen
        const imageHeight = 100; // Altura deseada de la imagen

        print.image(footerImagePath, pageWidth - imageWidth - 10, pageHeight - imageHeight - 10, {
            width: imageWidth,
            height: imageHeight
        });


        // Finalizar documento
        print.end();
        res.sendFile(filePath);
        await Room.findOneAndUpdate(
            { _id: bill.room },
            {
                available: "DISPONIBLE"
            }
        )
        //await Bill.findOneAndDelete({ client: uid })
        return res.send({ message: "printed!" })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: "Error on the bill printing" })
    }
}