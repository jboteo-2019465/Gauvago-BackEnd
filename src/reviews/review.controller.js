'use strict'
import Review from "./review.model.js"
import Hotel from "../hotel/hotel.model.js"
import User from "../user/user.model.js"
import { checkUpdateRW } from "../utils/validator.js"


// Hace el test de review
export const test = (req, res) => {
    console.log('test panoli')
    return res.send({
        message: 'test'
    })
}

// Registra la review
/*export const register = async (req, res) => {
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
} */

export const register = async (req, res) => {
    try {
        let data = req.body
        let user = req.user
        data.userR = user._id
        let review = new Review(data)
        let findUser = await Review.findOne({ userR: user._id })
        let findHotel = await Review.findOne({ hotelR: data.hotelR })

        //console.log(data.userR + " " + findUser.userR + " " + data.hotelR + " " + findHotel.hotelR)
        console.log(findUser)
        console.log(findHotel)
        //console.log(data.userR)
        let hotel = await Hotel.findById(data.hotelR)
        //console.log(hotel)
        
        if (!findUser || !findHotel) {
            const newStars = parseFloat((parseFloat(hotel.stars) + parseFloat(data.rating)) / 2)
            
            if (newStars > 5) {
                return res.status(400).send({ message: 'You cannot give more than 5 stars' })
            }

            hotel.stars = newStars;
            
            await hotel.save();
            await review.save();
            //console.log(data.userR + " " + findUser.userR + " " + data.hotelR + " " + findHotel.hotelR)
            return res.send({ message: 'The review has been registered' });
        } else {
            return res.status(400).send({ message: 'The review has NOT been registered' })
        }

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
}
// listar review

export const obtener = async (req, res) =>{
    try{
        let data = await Review.find()
        return res.status(200).send({data})
    }catch(error){
        console.error(error)
        return res.status(500).send({message: 'the information cannot be brought'})
    }
}

//Buscar por paramtros la review

export const searchRW = async (req, res)=>{
    try{
        let { search } = req.body
        search = search.trim()
        let review = await Review.find({review: { $regex: search, $options: 'i'}})
        if(!review || review.length === 0){
            return res.status(400).send({message: 'Review not found'})
        }

        return res.send({message: 'Review found', review})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching review'})
    }
}

//Elimina una review

export const deleteRw = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await Review.findByIdAndDelete(id)
        if (!deletedReview) {
            return res.status(404).send({ message: 'Review not found' })
        }
        return res.status(200).send({ message: 'Review deleted successfully' })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting review' });
    }
};

//Update review
export const updateR = async (req, res) => {
    try {
        const { id } = req.params
        let data = req.body

        if (!checkUpdateRW(data, id)) {
            return res.status(400).send({ message: 'Invalid data' })
        }

        // esto hace que el usuario no cambie el id del hotel
        if (data.hotelR && data.hotelR !== id) {
            return res.status(400).send({ message: 'You cannot change the hotel ID' })
        }

        delete data.hotelR;
        if (data.rating < 1 || data.rating > 5) {
            return res.status(400).send({ message: 'The number of stars must be between 1 and 5' })
        }

        let updateReview = await Review.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )

        if (!updateReview) return res.status(401).send({ message: 'Review not found' })

        // actualiza las estrellas
        const findHotel = await Hotel.findById(updateReview.hotelR)
        if (!findHotel) {
            return res.status(404).send({ message: 'Hotel not found' })
        }

        // esto calcula la resea del hotel
        const newStars = parseFloat((parseFloat(findHotel.stars) + parseFloat(data.rating)) / 2)
        if (newStars > 5) {
            return res.status(400).send({ message: 'You cannot give more than 5 stars' })
        }
        findHotel.stars = newStars
        await findHotel.save()

        return res.send({ message: 'Review updated', updateReview })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error' })
    }
}