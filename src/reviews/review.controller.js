'use strict'
import Review from "./review.model.js"
import Hotel from "../hotel/hotel.model.js"

export const test = (req, res) =>{
    console.log('test panoli')
    return res.send({message: 'test'})
}

export const register = async (req, res) => {
    try {
        let data = req.body;
        let user = req.user; 
        data.user = user._id;
        let review = new Review(data);
        await review.save();
        let hotel = await Hotel.findById(review.hotel);
        
        if(hotel){
            hotel.stars = parseFloat((parseFloat(hotel.stars) + parseFloat(data.rating)) / 2);
            await hotel.save();
            console.log(hotel.stars)
        }
        return res.send({ message: 'The review has been registered' });        
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error registering the review' });
    }
}