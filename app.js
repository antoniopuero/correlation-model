var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var _ = require('lodash');
var texts = require('./texts');
var pwd = require('pwd');
var dbConfig = require('./db-config.json');
var db = require('./server-app/user-model')(dbConfig.prod);


app.set('views', './templates');
app.set('view engine', 'jade');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('build'));


function authenticate(firstName, lastName, pass, fn) {
  db.User.findOne({firstName: firstName, lastName: lastName}, function (err, user) {
    if (!user) return fn(new Error(texts.commonErrors.thereIsNoSuchUser));
    pwd.hash(pass, user.salt, function (err, hash) {
      if (err) return fn(err);
      if (hash == user.hash) return fn(null, user);
      fn(new Error(texts.commonErrors.invalidPassword));
    })
  })
}

// middleware
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = texts.commonErrors.accessDenied;
    res.redirect('/login');
  }
}

function adminRestrict (req, res, next) {
  if (req.session.user.admin) {
    next();
  } else {
    req.session.error = texts.commonErrors.accessDenied;
    res.redirect('/login');
  }
}

//router

app.get('/', restrict, function (req, res) {
  res.render('index', {texts: texts, session: req.session});
});

app.get('/login', function (req, res) {
  res.render('login', {texts: texts, session: req.session});
});

app.get('/finished', function (req, res) {
  res.render('finish', {texts: texts, session: req.session});
});


app.get('/admin', restrict, adminRestrict, function (req, res) {
  db.User.find({}, function (err, users) {
    var filteredUsers = _.filter(users, function (user) {
      return user.firstName && user.firstName !== 'admin';
    });
    res.render('admin', {texts: texts, session: req.session, users: filteredUsers});
  });
});


app.post('/login', function (req, res) {
  authenticate(req.body.firstName, req.body.lastName, req.body.userPassword, function (err, user) {
    if (user) {
      req.session.regenerate(function () {
        req.session.user = user;
        if (user.admin) {
          res.redirect('/admin');
        } else {
          res.redirect('/');
        }
      });
    } else {
      console.log(err);

      pwd.hash(req.body.userPassword, function(err, salt, hash) {
        if (err) {
          console.log(err);
        }

        var user = new db.User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          salt: salt,
          hash: hash
        });

        user.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("user saved");
            req.session.user = user;
            res.redirect('/');
          }
        });
      });
    }
  });
});

app.post('/finished', function (req, res) {
  db.User.findOne({firstName: req.session.user.firstName, lastName: req.session.user.lastName}, function (err, user) {
    user.done = true;
    user.save(function (err) {

      if (err) {
        console.log(err);
      } else {
        req.session.unset = 'destroy';
        res.redirect('/finished');
      }

    })
  });
});


app.get('/texts', function (req, res) {
  res.json(texts);
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});