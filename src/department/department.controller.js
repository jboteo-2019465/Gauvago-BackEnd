'use strict'

import Department from './department.model.js'
import { checkUpdate } from '../utils/validator.js'


//Registro de departamentos por defecto
export const registerD = async (req, res) => {
    try {
        // Lista de nombres de departamentos
        const departmentNames = [
            'Guatemala', 'Peten', 'Quetzaltenango', 'Retalhuleu', 'Sacatepequez', 
            'San Marcos', 'Solola', 'Totonicapan', 'Zacapa', 'Baja Verapaz', 
            'Chimaltenango', 'Chiquimula', 'El Progreso', 'Huehuetenango', 
            'Jalapa', 'Izabal', 'Jutiapa', 'Alta Verapaz', 'Quiche', 
            'Suchitepequez', 'Santa Rosa', 'Escuintla'
        ];

        // Buscar los departamentos existentes en la base de datos
        const existingDepartments = await Department.find({ nameDepartment: { $in: departmentNames } });

        // Crear un conjunto de nombres de departamentos existentes
        const existingDepartmentNames = new Set(existingDepartments.map(dep => dep.nameDepartment));

        // Filtrar los nombres de departamentos que no existen y crearlos
        const newDepartments = departmentNames.filter(name => !existingDepartmentNames.has(name));

        // Crear los nuevos departamentos
        const newDepartmentPromises = newDepartments.map(name => Department.create({ nameDepartment: name }));

        // Esperar a que se creen los nuevos departamentos
        await Promise.all(newDepartmentPromises);

        console.log("Departamentos registrados correctamente.");
    } catch (err) {
        console.error(err);
    }
}


//Obtener los departamentos
export const obtener = async (req, res) => {
    try {
        let data = await Department.find()
        return res.send(data)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Yhis information cannot be brought' })
    }
}

//Buscar individualmente los departamentos
export const searchD = async (req, res) => {
    try {
        let { search } = req.body
        let department = await Department.find({ nameDepartment: { $regex: search } });

        if (!department) {
            return res.status(404).send({ message: 'Department not found' })
        }
        return res.send({ message: 'Department Found', department })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error searching Department' })

    }
}

//Actualizar un departamento
export const updateD = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update or missing data' })
        let updateDepartment = await Department.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateDepartment) return res.status(401).send({ message: 'Department not found' })
        return res.send({ message: 'Updated department' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating' })
    }
}

//Eliminar un departamento
export const deleteD = async (req, res) => {
    try {
        const { nameDepa } = req.params

        const deleteDepartment = await Department.findOneAndDelete({ nameDepartment: nameDepa })
        if (!deleteDepartment) {
            return res.status(404).send({ message: 'Category not found and not delete' })
        }
        return res.send({ message: `Department whit name ${deleteDepartment.nameDepartment} deleted successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting department' })

    }
}

