require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const app = express();// Will integrate after recieving the frontend work 
const mongoose = require('mongoose');

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected ");
    })
    .catch(err => {
        console.error("not connected", err);
    });

const dataSchema = new mongoose.Schema({
    email: String,
}, {versionKey: false});

const GET_ALL_USERNAME = () => {
    const ALL_USERNAME = mongoose.model('Users', dataSchema);
    return ALL_USERNAME.find({}).lean()
}

GET_ALL_USERNAME().then((data) => {
    console.log("the data is as follows",data);
})
.catch((err) => {  
    console.log("there as an error ", err);
});