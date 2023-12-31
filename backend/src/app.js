require('dotenv').config()

const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');

const errorHandler = require('./middleware/errorHandler');

const sensorServer = require('./controllers/communication.js');
sensorServer.server.init();

const app = express();
app.keepSensorServerAlive = sensorServer;

app.use(cors());

app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError.NotFound());
});

// pass any unhandled errors to the error handler
app.use(errorHandler);

module.exports = app;