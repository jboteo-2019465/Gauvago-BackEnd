'use strict'
import Review from "./review.model.js"
import Hotel from "../hotel/hotel.model.js"


// Hace el test de review
export const test = (req, res) => {
    console.log('test panoli')
    return res.send({
        message: 'test'
    })
}

// Registra la review
export const register = async (req, res) => {
    try {
        const data = req.body;
        const user = req.user;

        // Validar los datos recibidos
        if (!data || !data.rating || !data.hotel) {
            return res.status(400).send({
                message: 'Missing required fields'
            });
        }

        // Agregar el usuario al objeto de la review
        data.user = user._id;

        // Verificar si el hotel existe
        const hotel = await Hotel.findById(data.hotel);
        if (!hotel) {
            return res.status(404).send({
                message: 'Hotel not found'
            });
        }

        // aaaa
        const existingReview = await Review.findOne({ hotel: data.hotel, user: user._id });
        if (existingReview) {
            return res.status(400).send({
                message: 'You have already reviewed this hotel'
            });
        }

        const review = new Review(data);
        await review.save();

        const existingReviewsCount = await Review.countDocuments({ hotel: data.hotel });
        const totalStars = hotel.stars * existingReviewsCount;
        const newStars = (totalStars + parseFloat(data.rating)) / (existingReviewsCount + 1);
        await Hotel.findOneAndUpdate({ _id: data.hotel }, { $set: { stars: newStars } });

        return res.send({
            message: 'The review has been registered'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: 'Error registering the review'
        });
    }
}