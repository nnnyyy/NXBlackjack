/**
 * Created by nnnyyy on 2018-11-22.
 */
'use strict'
const http = require('http');
const socketio = require('socket.io');
const sharedsession = require("express-socket.io-session");
const Promise = require('promise');
const P = require('../../common/protocol');
const DBHelper = require('./DBHelper');
const routes = require('../router/index.js');

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

class ServerManager {
    constructor(app) {
        this.http = http.Server(app);
        const sm = this;

        app.use(function(req, res, next) {
            req.sm = sm;
            next();
        } );
        app.use('/', routes );

        this.io = socketio(this.http, {
            origins: '*:*',
            pingInterval: 5000,
            pingTimeout: 10000,
            transports: ['websocket','polling']
        });
        this.io.use(sharedsession(app.session, {autoSave: true}));        
        this.init();
    }

    init() {       
        const sm = this;         
        this.updateIntervalID = setInterval( ()=>{ this.update(); }, 400);        

        new Promise(function(resolve, reject) {            
            resolve();
        })
        .then(function() {
                return new Promise(function( resolve, reject) {
                    resolve();                    
                });
            })
        .then(function() {
            sm.listen();
        });
    }

    listen() {
        const sm = this;

        let before = '';

        let port = normalizePort(process.env.PORT || '10001');

        sm.serv_name = 'Server15';
        sm.enterLimit = -1;

        process.argv.forEach(function(val, idx, arr) {
            if( before == '-p') {
                port = val;
            }

            if( before =='-name') {
                sm.serv_name = val;
            }

            before = val;
        })        

        this.http.listen(port, function() {
            console.log('Server listening on *:' + port);
        });

        this.io.on('connection', function(socket) {
            
        });        
    }

    //  #업데이트
    update() {        
        const tCur = new Date();
        try {            
        }catch(e) {
            console.log(e);
        }
    }

     

    sendPacket( socket, protocol, data ) {
        socket.emit(protocol, data);
    }

    broadcastPacket( protocol, data ) {
        this.io.sockets.in('auth').emit( protocol, data );
    }

    broadcastAllPacket( protocol, data ) {
        this.io.sockets.emit( protocol, data );
    }

    setPreListener( socket ) {        
        const sm = this;        
        socket.on(P.SOCK.Disconnect, function() { sm.onDisconnect(socket); });
    }
    
    onDisconnect(sock) {
        try {            

        }catch(e) {            
        }
    }    

    //  유저가 접속합니다.
    connectUser(socket) {        
    }

    checkReconnect(id) {
    }

    setReconnect(socket, id) {        
    }

    getUser( id ) {        
    }

    getUserBySocket( socket ) {        
    }    
}

module.exports = ServerManager;