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
const routesAuth = require('../router/Auth.js');
const BJLobby = require('./BlackjackLobby');
const User = require('./User');

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
        app.use('/auth', routesAuth);

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
        this.updateIntervalID = setInterval( ()=>{ this.update(); }, 400);
        this.pm_init_variable(this)
        .then(this.pm_init_blackjackLobby)
        .then(parent => this.listen());
    }

    pm_init_variable(parent) {
        return new Promise((res,rej)=> {
            parent.mUsers = new Map();
            res(parent);
        });
    }

    pm_init_blackjackLobby(parent) {        
        return new Promise((res,rej)=> {            
            parent.lobby = new BJLobby(parent);            
            res(parent);
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

        this.io.on('connection',(socket)=>this.connectUser(socket)); 
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
        this.io.sockets.emit( protocol, data );
    }

    setPreListener( socket ) {        
        const sm = this;        
        socket.on(P.Disconnect, () => { this.onDisconnect(socket); });
    }
    
    onDisconnect(sock) {
        try {
            console.log('socket disconnected : ', sock.id);
        }catch(e) {            
        }
    }    

    //  유저가 접속합니다.
    connectUser(socket) {
        try {
            console.log('socket connect user');
            this.setPreListener(socket);        

            if( !this.checkLoginState(socket) ) {
                this.disconnectUser(socket, true);
                return;
            }

            const sessionInfo = this.getSessionInfo(socket);
            if( !sessionInfo ) {
                this.disconnectUser(socket, true);
                return;
            }
            
            if( this.mUsers.has(sessionInfo.id) ) {
                this.reconnectUser(socket, sessionInfo.id);
                return;
            }

            //  신규 접속
            let newUser = this.createUser(socket, sessionInfo);
            this.addUser(newUser);

            this.sendPacket(socket, P.EnterUser, sessionInfo);
            this.broadcastPacket(P.RefreshLobbyInfo);

        } catch(e) {
            console.log(e);
        }       
    }

    getSessionInfo(socket) {
        return socket.handshake.session.user;
    }

    reconnectUser(socket, id) {        
    }

    disconnectUser(socket, forceDelete) {
        if( forceDelete ) {
            // 소켓 연결 끊기
            socket.disconnect('unauthorized');
            return;
        }        
    }

    getUser( id ) {        
    }

    getUserBySocket( socket ) {        
    }

    checkLoginState(socket) {
        if( !socket.handshake.session.user ) return false;
        
        return true;
    }

    createUser(socket, sessionInfo) {
        let user = new User(socket, this);
    }

    addUser(user) {
        try {
            if( !user ) return;
            if( !user.id ) return;

            this.mUsers.set(user.id , user);

        }catch(e) {
            console.log(e);
        }
    }
}

module.exports = ServerManager;