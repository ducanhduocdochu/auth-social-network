'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

// Count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections: ${numConnection}`)
}

// Check over load
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss
        // Example maximum number of connections based on number of cores
        console.log(`Active connection: ${numConnection}`)
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)
        const maxConnections = numCores*5
        if (numConnection > maxConnections){
            console.log('Connection overload detected')
        }
    }, _SECONDS) // Monitor every 5 seconds
}

module.exports = {
    checkOverload,
    countConnect
}