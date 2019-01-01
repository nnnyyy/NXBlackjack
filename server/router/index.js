/**
 * Created by nnnyyy on 2018-11-23.
 */
'use strict';

const express = require('express');
const Router = express.Router();

Router.get('/', function(req, res, next) {
    res.render('index',{user: req.session.userdata});
});

Router.get('/m', function(req, res, next) {
    res.render('index');
});

Router.get('/login', function(req, res, next) {
    res.render('index', {user: req.session.userdata});
});

Router.get('/userinfo', function(req, res, next) {
    res.send(req.session.userdata);
});

Router.post('/searchdb', function(req,res, next) {
    req.sm.searchLocalDB(req.body.query, function(result) {
        res.send(result);
    });
});

module.exports = Router;