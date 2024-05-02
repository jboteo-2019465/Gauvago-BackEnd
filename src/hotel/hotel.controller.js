'use strict'

import Hotel from './hotel.model.js'
import {checkUpdateH} from '../utils/validator.js'


//Test de hotel
export const test = (req, res) =>{
    console.log('test panoli')
    return res.send({message: 'test'})
}

//Registra el hotel
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
        return res.status(400).send({ message: 'The hotel already exists or repeated data. The data that cannot be repeated is the name, address and telephone number.' });
      }
      let hotel = new Hotel(data);
      await hotel.save();
      return res.send({ message: '¡The hotel has been successfully registered!' });
    } catch (err) {
      return res.status(500).send({ message: 'Error registering the hotel', err: err });
    }
  };


  //Lista el hotel
  export const obtener = async (req, res) => {
    try {
        let data = await Hotel.find()
        return res.send({ data })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
    }
}


//Actualiza el hotel
export const updateH = async(req, res)=>{
  try {
      let {id} = req.params
      let data = req.body
      
      if (!checkUpdateH(data, id)) {
        return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'});
      }

      let updateHotel = await Hotel.findOneAndUpdate(
          { _id: id },
          data,
          {new: true} 
      )
      if (!updateHotel) return res.status(401).send({ message: 'Hotel not found' })
      return res.send({ message: 'Hotel updated', updateHotel })
  } catch (error) {
      console.error(error)
      return res.status(500).send({ message: 'Error updating' })
  }
}

//Elimina el hotel
export const deleteH = async (req, res) => {
  try {
      const { id } = req.params;
      
      // Eliminar la categoría
      const deletedHotel = await Hotel.findOneAndDelete({ _id: id });
      if (!deletedHotel) {
          return res.status(404).send({ message: 'Hotel not found and not deleted' });
      }

      return res.send({ message: `Hotel with name ${deletedHotel.nameHotel} deleted successfully` });
  } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error deleting Hotel' });
  }
}

//Busca el hotel por parametros
export const searchH = async (req, res) => {
  try {
      let { search } = req.body;
      search = search.trim();
      let hotel = await Hotel.find({ nameHotel: { $regex: search, $options: 'i' } });

      if (!hotel || hotel.length === 0) {
          return res.status(404).send({ message: 'Hotal not found' });
      }

      return res.send({ message: 'Hotal found', hotel });
  } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error searching Hotel' });
  }
}