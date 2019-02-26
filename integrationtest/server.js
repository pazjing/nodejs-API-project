//server.js
const app = require('./app');

require('./db').connect();

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});