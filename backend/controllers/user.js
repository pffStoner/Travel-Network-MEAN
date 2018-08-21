const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const axios = require('axios');

exports.userSignup =  (req, res, next) => {
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
              message: 'Invalid authentication credentials!'});
        });
    });
  };

  exports.userLogin = (req, res, next) => {
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
          message: 'Invalid authentication credentials!'
        });
      });
  };