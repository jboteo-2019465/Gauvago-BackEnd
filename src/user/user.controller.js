'use strict'

import User from './user.model.js'
import { checkUpdate } from '../utils/validator.js'
import jwt from 'jsonwebtoken'
import { encrypt, checkPassword, checkOldPassword, hashPassword } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'
import { upload } from '../utils/multerConfig.js';


export const test = (req, res) => {
    console.log('Hola chitu')
    return res.send({ message: 'Test is running' })
}

export const defaultUser = async () => {
    try {
        const userExist = await User.findOne({ username: 'default' })

        if (userExist) {
            return console.log('The default user already exists')
        }
        let data = {
            name: 'Default',
            surname: 'default',
            username: 'default',
            email: 'default@gmail.com',
            password: await encrypt('1'),
            role: 'ADMIN'
        }
        let user = new User(data)
        await user.save()
        return console.log('Updated user', data)
    } catch (err) {
        console.error(err)
    }
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
        let data = req.body
        let update = checkUpdate(data)
        let secretKey = process.env.SECRET_KEY
        let { authorization } = req.headers
        let { uid } = jwt.verify(authorization, secretKey)// extrae del token el uid para no ponerlo en la url
        const { oldPassword, newPassword } = data // se agreagan 2 campos por si se quiere cambiar la contraseña que ponga la antigua

        let user = await User.findOne({ _id: uid }) // verifica si el uid del token es valido
        if (!user) return res.status(404).send({ message: 'User not found' })

        // verifica si la contraseña antigua es correcta
        if (oldPassword) {
            const isPasswordCorrect = await checkOldPassword(oldPassword, user.password)
            if (!isPasswordCorrect) return res.status(401).send({ message: 'Incorrect old password' })
        }

        // hace el cambio de la nueva contraseña con su encriptación
        if (newPassword) {
            const hashedPassword = await hashPassword(newPassword)
            data.password = hashedPassword
        }

        // verficacion del update si los datos que quiere actualizar son los que requiere el campo
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })

        let updatedUser = await User.findOneAndUpdate(
            { _id: uid },
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


// delete
export const deleteU = async (req, res) => {
    try {
        let secretKey = process.env.SECRET_KEY
        let { authorization } = req.headers
        let { uid } = jwt.verify(authorization, secretKey)// extrae del token el uid para no ponerlo en la url
        let { confirmation } = req.body // Agrega un campo de confirmación 

        // verifica si el campo confirmation es no que de el siguiente mensaje y que no ejecute nada
        if (confirmation === 'no') {
            return res.status(200).send({ message: 'Deletion cancelled by user' })
        }
        // verifica si el campo confirmation es si que continue con el proceso de eliminacion al igual que si se pone otra palabra que no sea
        // si o no que tire el mensaje que solo se puede poner si o no
        if (confirmation !== 'yes') {
            return res.status(400).send({ message: 'Please confirm the deletion by providing confirmation: "yes or no"' })
        }

        let deletedUser = await User.findOneAndDelete({ _id: uid })

        if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })

        return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}

//Obtener
export const getUser = async (req, res) => {
    try {
      let data = await User.find()
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

  //usuario logeado
  export const getLoggedUser = async (req, res) => {
    try {
        let user = req.user
        let uid = req.user._id
        let userLogged = await User.findOne({ _id: uid })
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }
        return res.send({ userLogged })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting user' })
    }
}

// Función para manejar la carga de imágenes
export const uploadImage = (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: err.message });
        }

        try {
            let secretKey = process.env.SECRET_KEY
            let { authorization } = req.headers
            let { uid } = jwt.verify(authorization, secretKey)
            const imagePath = req.file.path;

            // Aquí guardamos la URL de la imagen en la base de datos
            const user = await User.findByIdAndUpdate(uid, { profileImageUrl: imagePath }, { new: true });

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            return res.send({ message: 'Image uploaded and user updated successfully', imageUrl: imagePath });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Internal server error' });
        }
    });
};