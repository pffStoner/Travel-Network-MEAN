const express = require('express');
const Event = require('../models/event');
const checkAuth = require('../middleware/check-auth');
var ObjectId = require('mongodb').ObjectID;

const router = express.Router();

router.post("/api/events", checkAuth, (req, res, next) => {
    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        img: req.body.img,
        tasks: req.body.tasks,
        gallery: req.body.gallery,
        createdBy: req.userData.userId,
        startDate: req.body.startDate,
        endDate: req.body.endDate
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
        createdBy: req.userData.userId,
        startDate: req.body.startDate,
        endDate: req.body.endDate
        

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

router.get("/api/events/:id", (req, res, next) => {
    Event.findById(req.params.id).then(event => {
        if (event) {
            res.status(200).json(event)
        } else {
            res.status(400).json({ message: 'Event not found!' });
        }
    });
});
// add map
router.put("/api/events/map/:id", checkAuth, (req, res, next) => {
    const map = req.body;
    const id = req.params.id;
    Event.findByIdAndUpdate(id, { $set: { map: map } }, { new: true }, function (err, event) {
        if (err) return console.log(err);
        (err);
        res.send(event);
        console.log(event);
    });
});
router.get('/api/events/map/:id', (req, res, next) => {

    var query = Event.findById(req.params.id).select('map');

    query.exec(function (err, mapInfo) {
        if (err) return next(err);
        res.status(200).json(mapInfo);
    });
});




router.put("/api/events/task/:id", checkAuth, (req, res, next) => {
    const userId = req.body.userId;
    const taskId = req.body.taskId;
    const taskComplete = req.body.taskComplete;
    //const id = req.params.id;
    console.log(req.body);
    Event.update({ 'tasks._id': taskId }, {
        '$set': {
            'tasks.$.userId': userId,
            'tasks.$.completed': taskComplete
        }
    }, function (err, task) {
        //   if (err) return handleError(err);
        res.send(task);
        console.log(task);
    });
});

//taskComplete

// router.put("/api/events/task/:id", checkAuth, (req, res, next) => {
//     const userId = req.body.userId;
//     const taskId = req.body.taskId;
//     const id = req.params.id;
//     console.log(req.body);
//     Event.update({ 'tasks._id': taskId }, {
//         '$set': {
//             'tasks.$.userId': null
//         }
//     }, function (err, task) {
//         //   if (err) return handleError(err);
//         res.send(task);
//         console.log(task);
//     });
// });


// router.get("/api/events/tasks/:id", (req, res, next) => {
//   //  userId = req.params.id;
//     Event.find({'tasks': { $elemMatch: { userId:  req.params.id} }})
//    .where({'tasks.userId': { $exists: true }})
//    .select('tasks name')
//     .then(docs => {
//     res.status(200).json({
//   //  count: docs.length,
//    event: docs
//     });
//     })
//     // Event.find({'tasks.userId': userId},function (err, task) {
//     // //    if (err) return handleError(err);
//     //     res.send(task);
//     //     console.log(task);
//     // }).select('tasks');
// });
router.get("/api/events/tasks/:id", (req, res, next) => {
    userId = req.params.id;
    Event.aggregate([
     
        { $unwind: "$tasks" },
      {   $match : {'tasks.userId': userId }},
        {
            $project: {
                _id: "$tasks._id",
                name: "$tasks.name",
                description: "$tasks.description",
                userId: '$tasks.userId',
                eventName: '$name',
                completed: '$tasks.completed'
            }
        }
    ])
        .then(docs => {
            res.status(200).json({
                //  count: docs.length,
                tasks: docs
            });
        })
});


// router.put("/api/events/joinEvent/:id", checkAuth, (req, res, next) => {
//     const userId = req.body.userId;
//     const taskId = req.body.username;

//     //const id = req.params.id;
//     console.log(req.body);
//     Event.update({ 'members._id': taskId }, {
//         '$set': {
//             'tasks.$.userId': userId,
//             'tasks.$.completed': taskComplete
//         }
//     }, function (err, task) {
//         //   if (err) return handleError(err);
//         res.send(task);
//         console.log(task);
//     });
// });

router.put("/api/events/joinEvent/:id", checkAuth, (req, res, next) => {
    // const userId = req.body.userId;
    // const username = req.body.username;
    const eventId = req.params.id;
   const member = {
    userId: req.body.userId,
    username: req.body.username
   }
   Event.update(
    { _id: eventId },
    { $push: { members: member } }
 ) .then(docs => {
     console.log(docs);
     
    res.status(200).json({
        //  count: docs.length,
        tasks: docs
    });
})
});
// not goint to event
router.put("/api/events/cancelEvent/:id", checkAuth, (req, res, next) => {
    // const userId = req.body.userId;
    // const username = req.body.username;
    const eventId = req.params.id;
   const member = {
    userId: req.body.userId,
    username: req.body.username
   }
   Event.update(
    { _id: eventId },
    { $pull: { members: {userId: req.body.userId, username: req.body.username }} }
 ) .then(docs => {
     console.log(docs);
     
    res.status(200).json({
        //  count: docs.length,
        tasks: docs
    });
})
});
// question wall
router.put("/api/events/questions/:id", checkAuth, (req, res, next) => {
    const eventId = req.params.id;
   const question = {
    userId: req.body.userId,
    username: req.body.username,
    question: req.body.question
   }

   Event.update(
    { _id: eventId },
    { $push: { questions: question } }
 ) .then(docs => {
     console.log(docs);
     
    res.status(200).json({
        //  count: docs.length,
        question: question
    });
})
});
router.put("/api/events/answers/:id", checkAuth, (req, res, next) => {
    const eventId = req.params.id;
    const questionId = req.body.questionId;
   const answer = {
    userId: req.body.userId,
    username: req.body.username,
    answer: req.body.answer,
   }

// const eventId = "5b642f7f3691966d441e1ac1";
// const questionId = "5b6c0f13ae5e9597f8f742f6";
// const answer = {
// username: 'mitko',
// answer: 'yes be',
// }
    Event.update(
        { "questions._id": questionId},
        { $push: 
            {"questions.$.answers": answer
            }
        }
    ).then(docs => {
        console.log(docs);
        
    res.status(200).json({
        //  count: docs.length,
        answer: answer
    });
    })

//    Event.update(
//     { _id: eventId },
//     { $push: { questions: question } }
//  ) .then(docs => {
//      console.log(docs);
     
//     res.status(200).json({
//         //  count: docs.length,
//         question: docs
//     });
// })
});


router.get('/api/questions/:id', (req, res, next) => {
    username='mitko';
    eventId = req.params.id;
     Event.aggregate([
     
        { $unwind: "$questions" },
      {   $match : {_id: ObjectId(eventId) }},
        {
            $project: {
                _id: "$questions._id",
                eventId : "$_id",
                username: "$questions.username",
                question: "$questions.question",
                userId: '$questions.userId',
                answers: '$questions.answers'
            }
        }
    ])
        .then(docs => {
            res.status(200).json({
                //  count: docs.length,
                questions: docs
            });
        })

    // Event.find()
    // .select('questions')
    // .then((document) => {
    //    // console.log('get ' + document);
    //     res.status(200).json({
    //         message: "Event fetched successfully!",
    //         events: document
    //     });
    // });
});


router.get('/api/questions', (req, res, next) => {
    username='mitko';
    eventId = req.params.id;


    Event.find()
    .select('questions')
    .then((document) => {
       // console.log('get ' + document);
        res.status(200).json({
            message: "Event fetched successfully!",
            questions: document
        });
    });
});


// db.survey.update(
//     { },
//     { $pull: { results: { score: 8 , item: "B" } } },
//     { multi: true }
//   )
module.exports = router;