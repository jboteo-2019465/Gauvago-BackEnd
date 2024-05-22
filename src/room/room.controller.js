'use strict'

import { checkUpdateH } from '../utils/validator.js'
import Room from './room.model.js'


//registra una habitacion
export const registerR = async (req, res) => {
  try {
    let data = req.body;
    data.available = 'DISPONIBLE'
    let room = new Room(data);
    await room.save()
    return res.send({ message: '¡The room has been successfully registered!' });
  } catch (err) {
    return res.status(500).send({ message: 'Error registering the room', err: err });
  }
};


//lista las habitaciones
export const obtener = async (req, res) => {
  try {
    let data = await Room.find().populate('category',).populate('hotel', 'nameHotel');
    return res.send({ data })
  } catch (error) {
    console.error(error)
    return res.status(500).send({ message: 'the information cannot be brought' })
  }
}

//elimina una habitacion
export const deleteR = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await Room.findOneAndDelete({ _id: id });
    if (!deletedRoom) {
      return res.status(404).send({ message: 'Room not found and not deleted' });
    }
    return res.send({ message: `Room with name ${deletedRoom.nameRoom} deleted successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Error deleting Room' });
  }
}

//busca por parametros las habitaciones
export const searchR = async (req, res) => {
  try {
    let { search, searchId } = req.body;
    if (search) {
      search = search.trim();
    }

    let rooms;

    if (search && searchId) {
      // Buscar por nombre de hotel (insensible a mayúsculas y minúsculas) o por admin o por ID
      rooms = await Room.find({
        $or: [
          { nameRoom: { $regex: search, $options: 'i' } },
          { hotel: searchId },
          { _id: searchId }
        ]
      }).select('-__v'); // Excluir el campo __v
    } else if (search) {
      // Buscar solo por nombre de hotel (insensible a mayúsculas y minúsculas)
      rooms = await Room.find({ nameRoom: { $regex: search, $options: 'i' } }).select('-__v');
    } else if (searchId) {
      // Buscar solo por admin o por ID
      rooms = await Room.find({
        $or: [
          { hotel: searchId },
          { _id: searchId }
        ]
      }).select('-__v');
    } else {
      return res.status(400).send({ message: 'No search parameters provided' });
    }

    if (!rooms || rooms.length === 0) {
      return res.status(404).send({ message: 'Rooms not found' });
    }

    return res.send({ message: 'Rooms found', rooms });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Error searching rooms' });
  }
};


//actualiza la habitacion
export const update = async (req, res) => {
  try {
    let { id } = req.params
    let data = req.body
    if (!checkUpdateH(data, id)) {
      return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' });
    }

    let updateRoom = await Room.findOneAndUpdate(
      { _id: id },
      data,
      { new: true }
    )
    if (!updateRoom) {
      return res.status(404).send({ message: 'Room not found' });
    }
    return res.send({ message: 'Room updated successfully', updateRoom });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Error searching Room' });
  }
}


//Buscar room de un hotel
//Subida de imagenes
export const handleImageUpload = (req, res) => {
  upload.single('image')(req, res, async (err) => {
      if (err) {
          return res.status(400).send({ message: err.message });
      }

      try {
          const imageData = fs.readFileSync(req.file.path);
          const base64Image = Buffer.from(imageData).toString('base64');
          const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

          const room = await Room.findByIdAndUpdate(uid, { imageUrl: imageUrl }, { new: true });

          if (!room) {
              return res.status(404).send({ message: 'Room not found' });
          }

          return res.send({ message: 'Image uploaded and room updated successfully', imageUrl });
      } catch (error) {
          console.error(error);
          return res.status(500).send({ message: 'Internal server error' });
      }
  });
};
