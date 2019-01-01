/**
 * Created by nnnyyy on 2018-11-23.
 */
'use strict';

const express = require('express');
const Router = express.Router();

Router.get('/', function(req, res, next) {
    res.render('index',{user: req.session.userdata});
});

Router.get('/login', function(req, res, next) {
    res.render('index');
});

module.exports = Router;