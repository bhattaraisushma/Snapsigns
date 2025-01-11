const express = require('express');
const router = express.Router();
const textCon = require('./text.controller');

router.post('/process-text', textCon.processText);

module.exports = router;
