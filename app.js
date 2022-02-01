var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var as1apiRouter = require('./routes/as1_api');
const { json } = require('body-parser');
var bodyParser = require('body-parser');
let dotenv = require('dotenv').config();
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'audioexpress.sqlite'
});

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    steamid64: {
      type: DataTypes.INTEGER
    },
    steamid32: {
      type: DataTypes.INTEGER
    },
    locationid: {
      type: DataTypes.INTEGER
    },
    gamepassword: {
      type: DataTypes.STRING
    }
}, {
    // Other model options go here
});

const Song = sequelize.define('Song', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING
  },
  artist: {
    type: DataTypes.STRING
  },
  fullTitle: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.artist} - ${this.title}`;
    },
    set(value) {
      throw new Error('Do not try to set the `fullTitle` value!');
    }
  },
  musicbrainzid: {
    type: DataTypes.STRING
  }
}, {
  // Other model options go here
});

const Score = sequelize.define('Score', {
  songid: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  scoretype: {
    type: DataTypes.INTEGER
  },
  leagueid: {
    type: DataTypes.INTEGER
  },
  "ride.username": {
    type: DataTypes.STRING
  },
  "ride.vehicleid": {
    type: DataTypes.INTEGER
  },
  "ride.score": {
    type: DataTypes.INTEGER
  },
  "ride.ridetime": {
    type: DataTypes.INTEGER
  },
  "ride.feats": {
    type: DataTypes.STRING
  },
  "ride.songlength": {
    type: DataTypes.INTEGER
  },
  "ride.trafficcount": {
    type: DataTypes.INTEGER
  }
}, {
  // Other model options go here
});

Song.hasMany(Score, { foreignKey: 'songid' });
Score.belongsTo(Song);

(async function() {
  await User.sync();
  await Song.sync();
  await Score.sync();
})();

var app = express();

app.disable('etag');
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/as', as1apiRouter);
//Why is this a thing
app.use('//as', as1apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;