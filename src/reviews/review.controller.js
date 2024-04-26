'use strict'
import Review from "./review.model.js"

export const test = (req, res) =>{
    console.log('test panoli')
    return res.send({message: 'test'})
}

export const register = async (req, res) => {
    try {
        let data = req.body;
        let review = new Review(data);
        await review.save();
        return res.send({ message: 'The review has been registered' });        
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error registering the review' });
    }
}