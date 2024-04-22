'use strict'

import {checkUpdateH} from '../utils/validator.js'
import Room from './room.model.js'

export const registerR = async (req, res) => {
  try {
    let data = req.body;
    let room = new Room(data);
    await room.save()
    return res.send({ message: '¡The room has been successfully registered!' });
  } catch (err) {
    return res.status(500).send({ message: 'Error registering the room', err: err });
  }
};

export const obtener = async (req, res) => {
  try {
    let data = await Room.find().populate('category',).populate('hotel', 'nameHotel');
    return res.send({ data })
  } catch (error) {
    console.error(error)
    return res.status(500).send({ message: 'the information cannot be brought' })
  }
}

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

export const searchR = async (req, res) => {
  try {
    let { search } = req.body;
    let room = await Room.find({ nameRoom: { $regex: search, $options: 'i' } });

    if (!room || room.length === 0) {
      return res.status(404).send({ message: 'Room not found' });
    }

    return res.send({ message: 'Room found', room });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Error searching Room' });
  }
}

export const update = async (req, res) => {
  try {
    let { id } = req.params
    let data = req.body
    if (!checkUpdateH(data, id)) {
      return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'});
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