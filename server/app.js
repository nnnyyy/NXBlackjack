/**
 * Created by nnnyyy on 2018-11-21.
 */
const express = require('express');
const path = require('path');
const ServerManager = require('./modules/ServerManager.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);

const redis = require('redis');
const client = redis.createClient();

var sessionMiddleware = session({
    secret: 'dhkddPtlra',
    resave: true,
    saveUninitialized: true,
    store: new redisStore({
        host: '127.0.0.1',
        port: 6379,
        client: client,
        prefix: "session-jamlive.net:a",
        db: 0
    })
});

const app = express();

app.set('views', path.join(__dirname, '..','view'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '..','dist')));
app.use(express.static(path.join(__dirname, '..','public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.session = sessionMiddleware;

const sm = new ServerManager(app);