'use strict'

const _ = require('lodash')
const {Types} = require('mongoose') 
const bcrypt = require('bcrypt')

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

const getInfoData = ({fileds = [], object = {}}) =>{
    return _.pick(object, fileds)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null){
            delete obj[k]
        }
    })
    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach( a => {
                final[`${k}.${a}`] = response[a]
            })
        }
        else{
            final[k] = obj[k]
        }
    })
    return final
}

async function generateSalt() {
    try {
        const saltRounds = 10; // Số vòng lặp (rounds)
        const salt = await bcrypt.genSalt(saltRounds);
        return salt;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb,
    generateSalt
}