'use strict'

import Category from './category.model.js'


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
  };


  export const obtener = async (req, res) => {
    try {
        let data = await Category.find()
        return res.send({ data })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
    }
}
