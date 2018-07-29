const express = require('express');
const Event = require('../models/event');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("/api/events", checkAuth, (req, res, next) => {
    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        img: req.body.img,
        tasks: req.body.tasks,
        gallery: req.body.gallery,
        createdBy: req.userData.userId
    });
    event.save().then(createdEvent => {
        res.status(201).json({
            message: 'Post added successfully',
            id: createdEvent._id,
            createdBy: createdEvent.createdBy

        });
    });
    console.log("пост" + event);

});

router.put("/api/events/:id", checkAuth, (req, res, next) => {
    const event = new Event({
        _id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        img: req.body.img,
        tasks: req.body.tasks,
        gallery: req.body.gallery,
        createdBy: req.userData.userId

    });
    Event.updateOne({ _id: req.params.id, createdBy: req.userData.userId }, event).then(resp => {
        console.log(resp);
        if (resp.nModified > 0) {
            res.status(201).json({
                message: 'Event updated successfully',
            });
        } else {
            res.status(401).json({ message: 'Not Authorizied' })
        }

    });
    console.log("пост update" + event);

});


router.get('/api/events', (req, res, next) => {

    Event.find().then((document) => {
        // console.log('get ' + document);
        res.status(200).json({
            message: "Event fetched successfully!",
            events: document
        });
    });
});

router.delete('/api/events/:id', checkAuth, (req, res, next) => {
    console.log(req.params.id);
    Event.deleteOne({ _id: req.params.id, createdBy: req.userData.userId }).then(result => {
        console.log('RESULT !!!!!!!!!!!!!!!!!!!!!!' + result);
        if (result.n > 0) {
            res.status(201).json({
                message: 'Event deleted successfully',

            });
        } else {
            res.status(401).json({ message: 'Not Authorizied' })
        }
    })
        .catch(err => {
            console.log(err);

        });

});

module.exports = router;