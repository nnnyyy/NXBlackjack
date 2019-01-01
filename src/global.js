/**
 * Created by nnnyyy on 2018-11-21.
 */
'use strict';

import P from '../common/protocol';
import $ from 'jquery'

class Global {
    constructor() {
        this.vBus = new Vue();        
    }

    connectSocket() {
        console.log('socket connecting...');
        this.socket = io();
        this.initSocketListener();
    }

    initSocketListener() {
        const g = this;               
    }
    
    sendPacket( protocol, packetData ) {
        this.socket.emit(protocol, packetData);
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