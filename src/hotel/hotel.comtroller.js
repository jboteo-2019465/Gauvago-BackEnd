'use strict'

import Hotel from './hotel.model.js'

export const test = (req, res) =>{
    console.log('test panoli')
    return res.send({message: 'test'})
}

export const registerH = async (req, res) => {
    try {
      let data = req.body;
      const existingHotel = await Hotel.findOne({
        $or: [
          { nameHotel: data.nameHotel},
          {address: data.address},{phoneHotel: data.phoneHotel}
        ]
      });

      if (existingHotel) {
        return res.status(400).send({ message: 'The hotel already exists or repeated data' });
      }
      let hotel = new Hotel(data);
      await hotel.save();
      return res.send({ message: '¡The hotel has been successfully registered!' });
    } catch (err) {
      return res.status(500).send({ message: 'Error registering the hotel', err: err });
    }
  };


  export const obtener = async (req, res) => {
    try {
        let data = await Hotel.find()
        return res.send({ data })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
    }
}
