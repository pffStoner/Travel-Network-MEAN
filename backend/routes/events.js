const express = require('express');
const Event = require('../models/event');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("/api/events",checkAuth, (req, res, next) => {
    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        img: req.body.img,
        tasks: req.body.task,
        gallery: req.body.gallery
    });
    event.save().then(createdEvent => {
        res.status(201).json({
            message: 'Post added successfully',
            id: createdEvent._id
        });
    });
    console.log("пост" + event);
    
});

router.put("/api/events/:id",checkAuth, (req, res, next) => {
    const event = new Event({
        _id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        img: req.body.img,
        tasks: req.body.task,
        gallery: req.body.gallery
    });
    Event.updateOne({_id:req.params.id}, event).then(resp => {
        console.log(resp);
        
        res.status(201).json({
            message: 'Post updated successfully',
        });
    });
    console.log("пост update" + event);
    
});


router.get('/api/events', (req, res, next) => {

    Event.find().then((document) => {
        console.log('get ' + document);
        res.status(200).json({
            message: "Posts fetched successfully!",
            events: document
        });
    });
});

router.delete('/api/events/:id',checkAuth, (req, res, next) => {
    console.log(req.params.id);
    Event.deleteOne({_id: req.params.id}).then(result => {
        console.log('RESULT !!!!!!!!!!!!!!!!!!!!!!'+result);
        res.status(200).json({
            msg: 'Event deleted',
            rrr: result
        });
        
    })
    .catch(err => {
        console.log(err);
        
    });
   
});

module.exports = router;