'use strict'

import Category from './category.model.js'
import { checkUpdateC } from '../utils/validator.js'


// Crea la categoria defualt
export const defaultCategory = async (req, res) => {
    try {
        const categoryExist = await Category.findOne({ nameCategory: 'default' })

        if (categoryExist) {
            return console.log('Category default', categoryExist)
        }
        let data = {
            nameCategory: 'default',
            role: 'category'
        }
        let category = new Category(data)
        await category.save()
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}

//registra la categoria
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


//Lista las categorias que ya estan registradas
export const obtener = async (req, res) => {
    try {
        let data = await Category.find({ role: 'category' }).populate('nameCategory')
        return res.send({ data })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
    }
}

export const obtenerFeatures = async (req, res) => {
    try {
        let data = await Category.find({ role: 'feature' }).populate('nameCategory')
        return res.send({ data })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
    }
}


//Busca la categoria por parametros
export const searchC = async (req, res) => {
    try {
        let { search } = req.body;
        let category = await Category.find({
            $and: [
                { nameCategory: { $regex: search, $options: 'i' } },
                { role: 'category' }
            ]
        }
        );

        if (!category || category.length === 0) {
            return res.status(404).send({ message: 'Category not found' });
        }

        return res.send({ message: 'Category found', category });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching Category' });
    }
}

export const searchF = async (req, res) => {
    try {
        let { search } = req.body;
        let category = await Category.find({
            $and: [
                { nameCategory: { $regex: search, $options: 'i' } },
                { role: 'feature' }
            ]
        }
        );

        if (!category || category.length === 0) {
            return res.status(404).send({ message: 'Category not found' });
        }

        return res.send({ message: 'Category found', category });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching Category' });
    }
}

//Actualiza la categoria
export const updateC = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdateC(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update or missing data' })
        let updateCategory = await Category.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateCategory) return res.status(401).send({ message: 'Category not found' })
        return res.send({ message: 'Category', updateCategory })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating' })

    }
}


//Elimina la categoria
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