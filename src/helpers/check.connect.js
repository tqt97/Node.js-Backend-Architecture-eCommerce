'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')

const _SECONDS = 60000 // 1 minute

/**
* Counts the number of connections in the mongoose connections array and logs the result.
*
* @return {number} The number of connections.
*/
const countConnect = () => {
    const numConnection = mongoose.connections.length

    return numConnection
}

/**
 * Check if the server is experiencing overload based on the number of connections, CPU cores, and memory usage.
 *
 * @return {undefined} This function does not return a value.
 */
const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = countConnect()
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss

        // Example max connection base on CPU cores
        const maxConnections = numCores * 5

        console.log(`\nCheck Overload at ${new Date()}\n`);
        const data_os = [
            { num_of_connection: numConnection, num_of_cores: numCores, memory_of_usage: memoryUsage / 1024 / 1024 + ' MB' }
        ];
        console.table(data_os);
        console.log(`\nEnd Check Overload\n-----------------------------\n`);

        if (numConnection > maxConnections) {
            console.error(`\nConnection OVERLOAD Detected: ${numConnection}/${maxConnections} connections\n`);
        }
    }, _SECONDS); //  monitoring every 60 seconds
}
module.exports = { countConnect, checkOverLoad }