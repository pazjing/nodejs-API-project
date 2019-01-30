const express = require('express');

const router = express.Router();

const courses = [
    { id: 1, name: 'Math', tutor: 'Alex' },
    { id: 2, name: 'English', tutor: 'Bob' },
    { id: 3, name: 'Art', tutor: 'Helen' }
];

router.get('/', (req, res) => {
    res.status(200).json(courses);
});

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)  return res.status(404).json({"error": `Course ${req.params.id} not found.`});
    res.status(200).json(course);
});

router.post('/', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).json({"error": error.details[0].message});
    const course = {
        id: parseInt(courses[courses.length-1].id) + 1,
        name: req.body.name,
        tutor: req.body.tutor
    };
    courses.push(course);
    res.status(200).json(course);
    
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
    // if id not found,  404 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).json({"error": `Course ${req.params.id} not found.`});

    // delete the course
    const index = courses.findIndex(c => c.id === parseInt(req.params.id));
    courses.splice(index, 1);
    res.status(200).json(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().alphanum().min(3).required(),
        tutor: Joi.string().alphanum().min(3).required()
    };
    return Joi.validate(course,schema);
}

module.exports = router;