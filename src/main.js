const express = require('express');
const exphbs = require('express-handlebars');
const xss = require('xss');
const app = express();
const port = process.env.PORT || 8080;;



//static files
app.use(express.static('public'));

//handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

const server = app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

//starting socket.io
const io = require('socket.io').listen(server);


module.exports.app = app;
module.exports.io = io;
module.exports.xss = xss;

//including files
require('./routes');
require('./app');
