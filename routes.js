const main = require('./main');

main.app.get('/', (req, res) => {
    res.render('index');
});

