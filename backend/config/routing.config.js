
const express = require('express');
const mainRoute = express.Router();
const textRouter = require('../modules/text/text.router');

mainRoute.use('/text', textRouter);

module.exports = mainRoute;
