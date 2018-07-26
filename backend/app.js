const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const axios = require('axios');

const eventsRoutes = require('./routes/events');
// aA188406.
const app = express();
mongoose.connect('mongodb+srv://mitko:aA188406.@cluster0-6rsnv.mongodb.net/network?retryWrites=true', { useNewUrlParser: true })
    .then(() => {
        console.log('conn to database');

    }).catch((err) => {
        console.log('falied to conn to db', err);

    });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use(eventsRoutes);
app.get('/api/places', (req, res, next) => {
    let data;
    axios
      .get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyCVpC92nFNJb4iSxbNkamDpsd70sa2likg')
        .then(response => {
            data = response.data;
            console.log(response.data);
            console.log(response.data.explanation);
            res.status(200).json({
                message: "Posts fetched successfully!",
                data: data
            });
        })
        .catch(error => {
            console.log(error);
        });



});

// places api


module.exports = app;