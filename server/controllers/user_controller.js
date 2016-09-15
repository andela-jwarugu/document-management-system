var User = require('../models/user.js');
var Document = require('../models/document.js');
var Role = require('../models/role.js');

module.exports = {
  create: function (req, res) {
    var user = new User();
    user.username = req.body.username;
    user.name = {first: req.body.first, last: req.body.last};
    user.email = req.body.email;
    user.password= req.body.password;

    Role.findOne( {title: req.body.role}, function (err, role) {
      if (err) {
        res.status(400).send({ message: 'Error occured' });
      }
      if (!role) {
        res.send({ message: 'No such role exists' });
      }
      else if (role) {
        user.role = role._id;

        user.save (function (err) {
          if (err) {
            if (err.code === 11000) {
              res.status(409).send({ message: 'Duplicate entry' });
            } else {
              res.status(400).send({ message: 'Error occured while saving the user' });
            }
          } else {
            res.status(200).send({ message: 'New user created' });
          }
        });
      }
    });
  },
  get: function (req, res) {
    User.find(function (err, users) {
      if (err) {
        res.status(400).send({ message: 'Error occured while accessing the user' });
      } else {
        res.status(200).json(users);
      }
    });
  },
  update: function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
      if (err){
        res.status(400).send({ message: 'Error occured while accessing the user.' });
      }
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      }
      else{
        if (req.body.username) { user.username = req.body.username; }
        if (req.body.first || req.body.last) { user.name = {first: req.body.first, last: req.body.last}; }
        if (req.body.email) { user.email = req.body.email; }
        if (req.body.password) { user.password= req.body.password; }

        user.save(function (err) {
          if (err) {
            res.status(400).send({ message: 'Error occured while saving the user.' });
          } else {
            res.status(200).send({ message: 'User has been updated' });
          }
        });
      }
    });
  },
  find: function (req, res) {
    User.findOne( {_id: req.params.user_id}, function (err, user) {
      if (err) {
        res.status(400).send({ message: 'Error occured while accessing the user.' });
      }
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(200).send(user);
      }
    });
  },
  remove: function (req, res) {
    User.remove(
      {_id: req.params.user_id}, function (err) {
        if (err) {
          res.status(400).send({ message: 'Error occured while accessing the user.' });
        }
        res.status(200).send({ message: 'User has been deleted' });
      });
  },
  findUserDocuments: function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
      if (err) {
        res.status(400).send({ message: 'Error occured while getting users' });
      }
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        Document.find( {ownerId: user._id} ).exec(function (err, documents){
          if (err){
            res.status(400).send({ message: 'Error occured while getting documents' });
          } else {
            res.json(documents);
          }
        });
      }
    });
  }
};
