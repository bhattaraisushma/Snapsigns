const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

require('./db.config');  

const Joi = require('joi');

const app = express();


app.use(helmet());        
app.use(cors());           
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  


const mainRouter = require('./routing.config');
app.use(mainRouter); 


app.use((req, res, next) => {
  next({
    code: 404,
    message: 'Resource not found',
  });
});


app.use((error, req, res, next) => {
  console.log(error instanceof mongoose.Error);  

  let statusCode = error.code || 500;
  let data = error.data || null;
  let message = error.message || 'Internal server error';


  if (error instanceof Joi.ValidationError) {
    statusCode = 422;
    message = 'Validation failed';
    data = {};

    const errorDetails = error.details;
    if (Array.isArray(errorDetails)) {
      errorDetails.forEach((errorObj) => {
        data[errorObj.context.label] = errorObj.message;
      });
    }
  }


  if (error.code === 11000) {
    statusCode = 400;
    data = {};
    const fields = Object.keys(error.keyPattern);
    fields.forEach((fieldName) => {
      data[fieldName] = `${fieldName} should be unique`;
    });
    message = 'Validation failed due to unique constraint violation';
  }

  res.status(statusCode).json({
    result: data,
    message: message,
    meta: null,
  });
});

module.exports = app;
