'use strict'

import Category from './category.model.js'
import {checkUpdateC} from '../utils/validator.js'

export const defaultCategory = async (req, res) => {
    try {
        const categoryExist = await Category.findOne({ nameCategory: 'default' })

        if (categoryExist) {
            return console.log('room estandar')
        }
        let data = {
            nameCategory: 'default',

        }
        let category = new Category(data)
        await category.save()
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}

export const registerC = async (req, res) => {
    try {
      let data = req.body;
      const existingCategory = await Category.findOne({ nameCategory: data.nameCategory });
        if (existingCategory) {
            return res.status(400).send({ message: 'Category already exists' });
        }
      let category = new Category(data);
      await category.save()
      return res.send({ message: '¡The Category has been successfully registered!' });
    } catch (err) {
      return res.status(500).send({ message: 'Error registering the Category', err: err });
    }
  }

  export const obtener = async (req, res) => {
    try {
        let data = await Category.find()
        return res.send({ data })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
    }
}

export const searchC = async (req, res) => {
    try {
        let { search } = req.body;
        let category = await Category.find({ nameCategory: { $regex: search, $options: 'i' } });

        if (!category || category.length === 0) {
            return res.status(404).send({ message: 'Category not found' });
        }

        return res.send({ message: 'Category found', category });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching Category' });
    }
}

export const updateC = async(req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let update = checkUpdateC(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be update or missing data'})
        let updateCategory = await Category.findOneAndUpdate(
            { _id: id },
            data,
            {new: true} 
        )
        if (!updateCategory) return res.status(401).send({ message: 'Category not found' })
        return res.send({ message: 'Category', updateCategory })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating' })
        
    }
}

export const deleteC = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Eliminar la categoría
        const deletedCategory = await Category.findOneAndDelete({ _id: id });
        if (!deletedCategory) {
            return res.status(404).send({ message: 'Category not found and not deleted' });
        }

        return res.send({ message: `Category with name ${deletedCategory.name} deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting Category' });
    }
}