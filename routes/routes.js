const express = require('express');

const router = express.Router();

const users = require('../util/users');

router.post('/do-register', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (users.has(username)) {
        return res.render('register.ejs', {errormessage: 'username already exists'});
    }
    else if (username !== '' && password !== '') {
        users.set(username, password);
        req.session.authentication = null;
        
        return res.redirect('/');
    }
    else {
        return res.render('register.ejs', {errormessage: 'username or password invalid'});
    }
});

router.post('/do-login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = users.has(username);
    const isPasswordCorrect = users.get(username) === password;

    req.session.authentication = {userExists, isPasswordCorrect};

    if (!userExists || !isPasswordCorrect) {
        return res.redirect('/');
    }
    else {
        users.set(username, password);
        req.session.authentication = {user: {username, password: users.get(username)}, isLoggedIn: true};

        return res.redirect('/home');
    }
});

router.post('/do-logout', (req, res, next) => {
    req.session.authentication = null;
    
    return res.redirect('/');
});

router.get('/home', (req, res, next) => {
    const isLoggedIn = req.session.authentication && req.session.authentication.isLoggedIn;
    console.log('/home, isLoggedIn: ' + isLoggedIn);

    if (isLoggedIn) {
        const username = req.session.authentication.user.username;

        return res.render('home.ejs', {username});
    }
    else {
        return res.send('<h1>Not Authorized</h1><a href="/">Back to login</a>');
    }
});

router.get('/register', (req, res, next) => {
    return res.render('register.ejs', {errormessage: null});
});

router.get('/', (req, res, next) => {
    let errormessage;
    if (req.session.authentication) {
        if (req.session.authentication.isLoggedIn) {
            return res.redirect('/home');
        }

        errormessage = (req.session.authentication.userExists === false) ? 'user doesnt exist' : (req.session.authentication.isPasswordCorrect === false) ? 'incorrect password' : null;
        req.session.authentication = null;
    }

    return res.render('index.ejs', {errormessage});
});

module.exports = router;