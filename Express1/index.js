const coreDebugger = require('debug')('app:core');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const express = require('express');
const courses = require('./routes/courses');
const home = require('./routes/home');
const Joi = require('joi');
const logger = require('./logger');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const path = require('path');
const fs = require('fs');
const requestId = require('express-request-id');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);
// console.log('Application Name: ' + config.get('name'));
// console.log('Mail Server: ' + config.get('mail.host'));
// console.log('Mail Password: ' + config.get('mail.password'));

// coreDebugger('Core Debugger -- ' + config.get('mail.password'));
// dbDebugger('DB Debugger -- ');

app.use(express.json());   //build-in
app.use(express.urlencoded({extended: true}));   //build-in
app.use(express.static('files'));  //build-in

app.use('/api/courses', courses);
app.use('/', home);

app.use(logger);  //customized

app.use(requestId());

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a'} );

//*****  Cannot get response body  */
// morgan.token('id', (req) => { return req.id; });
// morgan.token('reqBody', req => { return JSON.stringify(req.body) });
// morgan.token('resBody', (req, res) => {return JSON.stringify(res.body)});
// var loggerFormat = ':date[iso] :id :method :url \n :reqBody \n :status \n :resBody';
// app.use(morgan(loggerFormat, { stream: accessLogStream }));  // 3rd party
//*****  Cannot get response body  */

//morganBody(app, { noColors: true, stream: accessLogStream });

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listen on port ${port}...`));


