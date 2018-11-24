const path = require('path');

const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');

const app = express();

const routes = require('./routes/routes');

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'einspluseinsgleichdrei',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: 'auto'}
}));

app.use(routes);
app.use('/', (req, res, next) => {
    return res.status(404).send('<h1>No Page Found</h1>');
});

app.listen(3000);
