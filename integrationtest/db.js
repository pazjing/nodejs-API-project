const mongoose = require('mongoose');

module.exports = {
    connect: () => {
        mongoose.connect('mongodb://localhost/vidly',  { useNewUrlParser: true })
        .then(() => console.log('Connect to MongoDB...'))
        .catch((err) => console.log('Could not connect to MongDB...'));
    },
    disconnect: (done) => {
        mongoose.disconnect(done);
    },
};