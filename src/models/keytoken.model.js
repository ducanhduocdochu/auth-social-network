'use strict'

const {Schema, model} = require('mongoose'); 

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    publicKey:{
        type:String,
    },
    privateKey:{
        type:String,
    },
    refreshToken: {
        type: String,
    },
    refreshTokensUsed:{
        type:Array,
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamp: true
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);