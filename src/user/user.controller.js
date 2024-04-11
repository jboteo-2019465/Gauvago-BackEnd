'use strict'

import User from './user.model.js'
import { checkUpdate } from '../utils/validator.js'
import jwt from 'jsonwebtoken'
import { encrypt, checkPassword, checkOldPassword, hashPassword} from '../utils/validator.js'
import {generateJwt} from '../utils/jwt.js'

export const test = (req, res) =>{
    console.log('Hola chitu')
    return res.send({message:'Test is running'})
}

//registro Admin
export const registerAd = async (req, res) => {
    try {
        let data = req.body
        let exists = await User.findOne({
            $or: [
                {
                    user: data.username
                },
                {
                    email: data.email
                }
            ]
        })
        if (exists) {
            return res.status(500).send({ message: 'Email or username alredy exists' })
        }
        data.password = await encrypt(data.password)
        data.role = 'ADMIN'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}
// registro Admin hotel
export const registerHt = async (req, res) => {
    try {
        let data = req.body
        let exists = await User.findOne({
            $or: [
                {
                    user: data.username
                },
                {
                    email: data.email
                }
            ]
        })
        if (exists) {
            return res.status(500).send({ message: 'Email or username alredy exists' })
        }
        data.password = await encrypt(data.password)
        data.role = 'ADMINHOTEL'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}
// registro client
export const registerCl = async (req, res) => {
    try {
        let data = req.body
        let exists = await User.findOne({
            $or: [
                {
                    user: data.username
                },
                {
                    email: data.email
                }
            ]
        })
        if (exists) {
            return res.status(500).send({ message: 'Email or username alredy exists' })
        }
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

// login
export const login = async (req, res) => {
    try {
        let { username, password, email } = req.body
        let user = await User.findOne({
            $or: [
                {
                    username
                },
                {
                    email
                }
            ]
        })
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                surname: user.surname,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${loggedUser.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }

}

// update
export const updateU = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        let secretKey = process.env.SECRET_KEY
        let { authorization } = req.headers
        let { uid } = jwt.verify(authorization, secretKey)
        const { oldPassword, newPassword } = data
        data.user = uid

        let user = await User.findOne({ _id: data.user })
        if (!user) return res.status(404).send({ message: 'User not found' })

        if (oldPassword) {
            const isPasswordCorrect = await checkOldPassword(oldPassword, user.password)
            if (!isPasswordCorrect) return res.status(401).send({ message: 'Incorrect old password' })
        }

        if (newPassword) {
            const hashedPassword = await hashPassword(newPassword)
            data.password = hashedPassword
        }

        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })

        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )

        if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
        return res.send({ message: 'Updated user', updatedUser })
    
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating' })
    }
}
