"use strict";

const mongoose = require("mongoose");

const connectString = `mongodb://127.0.0.1:27017/shopDEV`;

mongoose
    .connect(connectString)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });
if(1 === 1){
    mongoose.set("debug", true);
    mongoose.set("debug", {color: true});
}    

module.exports = mongoose;
