/**
 * Created by nnnyyy on 2018-11-21.
 */
'use strict';

import P from '../common/protocol';
import $ from 'jquery'

class Global {
    constructor() {
        this.v = new Vue();        
    }

    connectSocket() {
        console.log('socket connecting...');
        this.socket = io();
        this.initSocketListener();
    }

    initSocketListener() {
        this.socket.on(P.GoLoginPage, packet => this.routePacket(P.GoLoginPage, packet));
        this.socket.on(P.EnterUser, packet => this.routePacket(P.EnterUser, packet));
        this.socket.on(P.Disconnect, () => { window.location.href = '/login/' });
    }

    on( protocol, cb ) {
        this.v.$bus.$on(protocol, cb);
    }

    hget( addr, cb ) {
        this.v.$http.get(addr).then(res => cb(res.data))
        .catch(err => console.log(err));
    }

    hpost( addr, item, cb ) {        
        this.v.$http.post(addr, item).then(res => cb(res.data))
        .catch(err => console.log(err));
    }
    
    sendPacket( protocol, packetData ) {
        this.socket.emit(protocol, packetData);
    }

    routePacket( protocol, packet ) {
        this.v.$bus.$emit(protocol, packet);
    }

    isMobile() {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            // is mobile..
            return true;
        }

        return false;
    }    
}

const GlobalObject = new Global();

export default GlobalObject