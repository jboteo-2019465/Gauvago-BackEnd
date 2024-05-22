'use strict'

import Hotel from './hotel.model.js'
import HotelRequest from './hotelRequest.model.js'
import User from '../user/user.model.js'
import Category from '../category/category.model.js'
import { upload } from '../utils/multerConfig.js';
import fs from 'fs';

import {
  checkUpdateH
} from '../utils/validator.js'


//Test de hotel
export const test = (req, res) => {
  console.log('test panoli')
  return res.send({
    message: 'test'
  })
}


//registrar la solicitud de hotel
export const registerHotelRequest = async (req, res) => {
  try {
    let data = req.body;
    let user = req.user
    data.applicant = user._id
    const existingHotel = await HotelRequest.findOne({
      $or: [{
        nameHotel: data.nameHotel
      },
      {
        address: data.address
      }, {
        phoneHotel: data.phoneHotel
      }
      ]
    });

    if (existingHotel) {
      return res.status(400).send({
        message: 'The hotel Request request already exists or repeated data. The data that cannot be repeated is the name, address and telephone number.'
      });
    }
    let hotelRequest = new HotelRequest(data);
    await hotelRequest.save();
    return res.send({
      message: '¡The hotel Request has been successfully registered!'
    });
  } catch (err) {
    return res.status(500).send({
      message: 'Error registering the hotel Request',
      err: err
    });
  }
};



// ver los datos de las solicitudes
export const getHotelRequest = async (req, res) => {
  try {
    let hotelRequest = await HotelRequest.find();
    return res.send({
      hotelRequest
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: 'Error getting hotel request'
    });
  }
}

//Registra el hotel

export const registerHotel = async (req, res) => {
  try {
    let data = req.body;

    let hotelRequest = await HotelRequest.findOne({
      nameHotel: data.nameHotel
    });
    if (hotelRequest) {
      let hotel = new Hotel({
        nameHotel: hotelRequest.nameHotel,
        description: hotelRequest.description,
        address: hotelRequest.address,
        phoneHotel: hotelRequest.phoneHotel,
        email: hotelRequest.email,
        admin: hotelRequest.applicant,
        department: hotelRequest.department
      });

      await hotel.save();
      let newAdmin = await User.findById(hotelRequest.applicant)
      if (newAdmin != "ADMIN") {

        await User.findByIdAndUpdate({
          _id: hotelRequest.applicant
        }, {
          role: "ADMINHOTEL"
        })
      }

      await HotelRequest.findByIdAndDelete(hotelRequest._id);
      return res.send({
        message: '¡The hotel has been successfully registered!'
      });
    } else {
      return res.status(400).send({
        message: 'The hotel request not found'
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: 'Error registering the hotel',
      err: err
    });
  }
};

//agregarle etiquetas a los hoteles
export const addFeatures = async (req, res) => {
  try {
    let { category, id } = req.body

    let hotel = await Hotel.findById(id)

    if (!hotel) return res.status(403).send(
      { message: 'You do not have any hotel' }
    )

    let items = await Category.findById(category)
    if (!items) return res.status(404).send(
      { message: 'Category not found' }
    )
    hotel.features.push({ category: category })

    await hotel.save()
    return res.send({ message: 'Has been successfully removed product to the shopping car' })



  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: 'Error registering the hotel',
      err: err
    });
  }
}


export const denyHotel = async (req, res) => {
  try {
    let data = req.body;

    let hotelRequest = await HotelRequest.findOne({
      nameHotel: data.nameHotel
    });
    await HotelRequest.findByIdAndDelete(hotelRequest._id);
    console.log("hotel denied")
    return res.send({ message: `Application with name ${hotelRequest.nameHotel} deleted successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: 'Error denying the hotel',
      err: err
    });
  }
}

//Lista el hotel
export const obtener = async (req, res) => {
  try {
    let data = await Hotel.find()
    return res.send({
      data
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: 'the information cannot be brought'
    })
  }
}


//Actualiza el hotel
export const updateH = async (req, res) => {
  try {
    let {
      id
    } = req.params
    let data = req.body

    if (!checkUpdateH(data, id)) {
      return res.status(400).send({
        message: 'Have submitted some data that cannot be updated or missing data'
      });
    }

    let updateHotel = await Hotel.findOneAndUpdate({
      _id: id
    },
      data, {
      new: true
    }
    )
    if (!updateHotel) return res.status(401).send({
      message: 'Hotel not found'
    })
    return res.send({
      message: 'Hotel updated',
      updateHotel
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: 'Error updating'
    })
  }
}

//Elimina el hotel
export const deleteH = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    // Eliminar la categoría
    const deletedHotel = await Hotel.findOneAndDelete({
      _id: id
    });
    if (!deletedHotel) {
      return res.status(404).send({
        message: 'Hotel not found and not deleted'
      });
    }

    return res.send({
      message: `Hotel with name ${deletedHotel.nameHotel} deleted successfully`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: 'Error deleting Hotel'
    });
  }
}

//Busca el hotel por parametros
export const searchH = async (req, res) => {
  try {
    let {
      search, searchId
    } = req.body;
    if (search) {
      search = search.trim();
    }
    let hotel = await Hotel.find({
      $or: [
        {
          _id: search,
        },
        {
          admin: search,
          nameHotel: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          _id: searchId,
        }
      ]
    });

    if (!hotel || hotel.length === 0) {
      return res.status(404).send({
        message: 'Hotal not found'
      });
    }

    return res.send({
      message: 'Hotal found',
      hotel
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: 'Error searching Hotel'
    });
  }
}

//Obtener las habitaciones de un hotel
export const obtenerHabitaciones = async (req, res) => {
  try {
    let hotelId = req.body;
    let data = await Room.find({ hotel: hotelId });
    return res.send(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'This information cannot be brought' });
  }
};

// Función para manejar la carga de imágenes
const saveImageUrls = async (idHotel, imageUrls) => {
  try {
      const hotel = await Hotel.findById(idHotel);
      if (!hotel) {
          throw new Error('Hotel not found');
      }
      hotel.imageUrls = [...hotel.imageUrls, ...imageUrls];
      await hotel.save();
      console.log(`Image URLs saved for hotel ${idHotel}: ${imageUrls.join(', ')}`);
  } catch (error) {
      console.error(error);
  }
};

/*
export const handleImageUpload = async (req, res) => {
  try {
      const { id } = req.params;

      if (!req.files || req.files.length === 0) {
          return res.status(400).send({ message: 'No images uploaded' });
      }

      const imageUrls = [];
      req.files.forEach(file => {
          const imagePath = path.join('images', id, file.filename);
          const imageData = fs.readFileSync(file.path);
          const base64Image = Buffer.from(imageData).toString('base64');
          const imageUrl = `data:${file.mimetype};base64,${base64Image}`;
          imageUrls.push(imageUrl);
      });

      const hotel = await Hotel.findByIdAndUpdate(id, { imageUrls: imageUrls }, { new: true });

      if (!hotel) {
          return res.status(404).send({ message: 'Hotel not found' });
      }

      return res.send({ message: 'Images uploaded and hotel updated successfully', imageUrls });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal server error' });
  }
};
*/

export const handleImageUpload = (req, res) => {
  upload.array('image', 5)(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    try {
      const { id } = req.params;
      const imageUrls = [];

      
      await Promise.all(req.files.map(async (file) => {
        const imageData = await fs.promises.readFile(file.path);
        const base64Image = Buffer.from(imageData).toString('base64');
        const imageUrl = `data:${file.mimetype};base64,${base64Image}`;
        imageUrls.push(imageUrl);
      }));

      console.log('Imagen URLs generadas:', imageUrls);

      const hotel = await Hotel.findByIdAndUpdate(id, { imageUrl: imageUrls }, { new: true });

      if (!hotel) {
        return res.status(404).send({ message: 'Hotel no encontrado' });
      }

      return res.send({ message: 'Imagen(es) subida(s) y hotel actualizado con éxito', imageUrls });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error interno del servidor' });
    }
  });
};
