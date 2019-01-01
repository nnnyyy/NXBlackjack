/**
 * Created by nnnyyy on 2018-11-23.
 */
'use strict';

const express = require('express');
const Router = express.Router();
const DBHelper = require('../modules/DBHelper');

Router.get('/checklogin', function(req, res, next) {    
    console.log(req.session.user);
    res.send({ret: req.session.user ? 0 : -1 });
});

//  로그인 처리
Router.post('/login', function(req, res, next) {    
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress.substr(7);

    DBHelper.login(req.body.id, req.body.pw, ip, result => {
        if( result.ret !== 0 )  {
            delete req.session;
        }
        else {
            req.session.user = { id: 'nnnyyy'}
            req.session.save();

            res.send({ret: 0 });
        }
    });    
});

module.exports = Router;