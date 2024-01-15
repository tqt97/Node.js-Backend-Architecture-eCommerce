'use strict'

const mongoose = require("mongoose")

const { host, port, dbName } = require("../configs/conf.mongodb")
const { countConnect } = require('../helpers/check.connect')

const connectString = `mongodb://${host}:${port}/${dbName}`; // mongodb://localhost:27017/shopDEV

console.log(`[INFO]::connectString::${connectString}`);

mongoose
    .connect(connectString)
    .then(() => {
        console.log(`MongoDB connected with ${countConnect()} connection at ${new Date()}\n`);
    })
    .catch((err) => {
        console.log(`Error Connect with MongoDB: ${err}`);
    });

// apply singleton pattern
class Database {
    constructor() {
        this.connect()
    }

    connect(type = "mongodb") {
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }

        mongoose.connect(connectString, { maxPoolSize: 50 }).then(_ => {
            // console.log(`MongoDB connected successfully with ${countConnect()} connection`);
        })
            .catch(err => console.log(`Error Connect with MongoDB: ${err}`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongoDB = Database.getInstance()

module.exports = instanceMongoDB