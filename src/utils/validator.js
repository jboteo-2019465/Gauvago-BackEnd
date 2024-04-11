'use strict'

import { hash, compare } from 'bcrypt'

//encriptar contra
export const encrypt = async (password) => {
    try {
        return hash(password, 10)
    } catch (err) {
        console.error(err)
        return err
    }
}

//validacion de contra
export const checkPassword = async (password, hash) => {
    try {
        return await compare(password, hash)
    } catch (err) {
        console.error(err);
        return err
    }
}

//validacion de contra con Update

export const checkOldPassword = async (oldPassword, hash) => {
    try {
        return await compare(oldPassword, hash);
    } catch (err) {
        console.error(err);
        throw new Error('Error comparing passwords');
    }
};

export const hashPassword = async (password) => {
    try {
        const hashedPassword = await hash(password, 10); 
        return hashedPassword;
    } catch (err) {
        console.error(err);
        throw new Error('Error hashing password');
    }
};


//Update user
export const checkUpdate = (data, userId) => {
    if (userId) {
        if (
            Object.entries(data).length === 0 ||
            data.password ||
            data.password == '' ||
            data.role ||
            data.role == ''
        ) {
            return false
        }
        return true
    } else {
        if (
            Object.entries(data).length === 0 ||
            data.category ||
            data.category == ''
        ) {
            return false
        }
        return true
    }
}  


//update category

export const checkUpdateC = (data, categoriesId) => {
    if (categoriesId) {
        if (Object.keys(data).length === 0) {
            return false;
        }
        for (const key in data) {
            if (data[key] === '') {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}