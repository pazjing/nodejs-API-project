const coreDebugger = require('debug')('app:core');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const express = require('express');
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


console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

coreDebugger('Core Debugger -- ' + config.get('mail.password'));
dbDebugger('DB Debugger -- ');

app.use(express.json());   //build-in
app.use(express.urlencoded({extended: true}));   //build-in
app.use(express.static('files'));  //build-in

app.use(logger);  //customized

app.use(requestId());

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a'} );

//*****  Cannot get response body  */
morgan.token('id', (req) => { return req.id; });
morgan.token('reqBody', req => { return JSON.stringify(req.body) });
morgan.token('resBody', (req, res) => {return JSON.stringify(res.body)});
var loggerFormat = ':date[iso] :id :method :url \n :reqBody \n :status \n :resBody';
app.use(morgan(loggerFormat, { stream: accessLogStream }));  // 3rd party
//*****  Cannot get response body  */

//morganBody(app, { noColors: true, stream: accessLogStream });


const courses = [
    { id: 1, name: 'Math', tutor: 'Alex' },
    { id: 2, name: 'English', tutor: 'Bob' },
    { id: 3, name: 'Art', tutor: 'Helen' }
];

app.get('/', (req, res) => {
    res.render('index', {title: 'My Express App', message: 'Hello~'});
});

app.get('/api/courses', (req, res) => {
    res.status(200).json(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)  return res.status(404).json({"error": `Course ${req.params.id} not found.`});
    res.status(200).json(course);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).json({"error": error.details[0].message});

    const course = {
        id: parseInt(courses[courses.length-1].id) + 1,
        name: req.body.name,
        tutor: req.body.tutor
    };

    console.log(res);
    console.log(res.body);
    courses.push(course);
    res.status(200).json(course);

    
});

app.put('/api/courses/:id', (req, res) => {
    // if id not found,  404 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).json({"error": `Course ${req.params.id} not found.`});

    // if body schema wrong, 400
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).json({"error": error.details[0].message});

    // update the course
    course.name = req.body.name;
    course.tutor = req.body.tutor;
    res.status(200).json(course);
});


app.delete('/api/courses/:id', (req, res) => {
    // if id not found,  404 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).json({"error": `Course ${req.params.id} not found.`});

    // delete the course
    const index = courses.findIndex(c => c.id === parseInt(req.params.id));
    courses.splice(index, 1);
    res.status(200).json(course);
});

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listen on port ${port}...`));


function validateCourse(course) {
    const schema = {
        name: Joi.string().alphanum().min(3).required(),
        tutor: Joi.string().alphanum().min(3).required()
    };

    return Joi.validate(course,schema);
}