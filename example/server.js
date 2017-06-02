/* eslint-env node */
/* global process */
var express = require('express');
var winston = require('winston');
var SplunkStreamEvent = require('winston-splunk-httplogger');
var expressLogger = require('express-winston');

var app = express();

var splunkSettings = {
  host: process.env.SPLUNK_HOST || 'localhost',
  token: process.env.SPLUNK_TOKEN
};

app.use(expressLogger.logger({
  transports: [
    new winston.transports.Console(),
    new SplunkStreamEvent({ splunk: splunkSettings })
  ],
  level: 'info'
}));

app.listen(process.env.PORT || 3000);
