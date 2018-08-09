const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require('axios');

const User = require("../models/user");
const MailBox = require("../models/user");


const router = express.Router();


router.post("/api/user/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/api/user/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      console.log(user);

      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expireIn: 3600,
        userId: fetchedUser._id,
        username: fetchedUser.username
        // TODO: ADD usename
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

router.put("/api/user/sendEmail/", (req, res, next) => {
  const recieveUserId = req.body.recieveUserId;
  const sendUsername = req.body.sendUsername;
  const sendUserId = "5b658af220d7f9b48cde0187";
  const mail = {
    title: req.body.title,
    date: req.body.date,
    content: req.body.content,
    username: req.body.sendUsername
  };
  const mailbox = new MailBox(
    {
      date: 'req.body.date' ,
      content: 'req.body.content',
      username: 'req.body.username'
    }
  );
  User.update(
    { _id: recieveUserId },
    { $push: { mailbox: mail } }
  ) .then(docs => {
     console.log('stana',docs);
     console.log(mailbox);

    res.status(200).json({
        count: docs.length,
        mailbox: docs
    });
  })

//   User.findOne({ _id: recieveUserId }, function (err, doc) {
//      if(err)
//     res.sendStatus(500);
//     if(!doc) { 
//       res.sendStatus(404);
//   }else {
//      doc.mailbox.push({ mailbox:  {
//       title: 'title' ,
//       date: 'req.body.date' ,
//       content: 'req.body.content',
//       username: 'req.body.username'
//     } });
//    doc.markModified('mailbox');
//     doc.save(); 
// } })

  
});

router.get('/api/users', (req, res, next) => {
  var query = User.findById('5b5a13758bf57790c4b44946').select('mailbox');

  query.exec(function (err, mails) {
      if (err) return next(err);
      res.status(200).json(mails);
  });

});

module.exports = router;