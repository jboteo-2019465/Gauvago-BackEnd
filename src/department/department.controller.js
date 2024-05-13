'use strict'

import Department from './department.model.js'
import {checkUpdate} from '../utils/validator.js'


//Registro de departamentos por defecto
export const registerD = async (req, res)=>{
    try {
        let data = req.body;
        const existingDepartment = await Department.findOne({nameDepartment: data.nameDepartment})
        if(existingDepartment){
            return res.status(400).send({message: 'This department alredy exists'})
        }

        let department = new Department(data)
        await department.save()
        return res.send({message: 'The department has been registered'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error registering the department'})
        
    }
}

//Obtener los departamentos
export const obtener = async(req, res)=>{
    try {
        let data = await Department.find()
        return res.send(data)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Yhis information cannot be brought'})
    }
}

//Buscar individualmente los departamentos
export const searchD = async(req,res)=>{
    try {
        let {search} = req.body
        let department = await Department.find({nameDepartment: {$regex: search}});

        if(!department){
            return res.status(404).send({message: 'Department not found'})
        }
        return res.send({message: 'Department Found', department})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching Department'})
        
    }
}

//Actualizar un departamento
export const updateD = async(req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be update or missing data'})
        let updateDepartment = await Department.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updateDepartment) return res.status(401).send({message: 'Department not found'})
        return res.send({message: 'Updated department'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating'})
    }
}

//Eliminar un departamento
export const deleteD = async(req, res)=>{
    try {
        const {nameDepa} = req.params

        const deleteDepartment = await Department.findOneAndDelete({nameDepartment: nameDepa})
        if(!deleteDepartment){
            return res.status(404).send({message: 'Category not found and not delete'})
        }
        return res.send({message: `Department whit name ${deleteDepartment.nameDepartment} deleted successfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting department'})
        
    }
}

