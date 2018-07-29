const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: {type: String, require: true} ,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
    description : {type: String, require: false},
    img :  {type: String, require: false},
    tasks : [{
        name: {type: String, require: false}
    }],
    gallery : [{
        src: {type: String, require: false}
    }]
});

module.exports = mongoose.model('event',eventSchema);