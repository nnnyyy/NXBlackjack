'use strict'

const BJRoom = require('./BlackjackGame');

class BlackJackLobby {
    constructor(sm) {
        console.log('BlackJackLobby Init');
        this.sm = sm;
        this.mRooms = new Map();
        this.mUsers = new Map();
    }

    enter(user) {
        try {
            if( this.mUsers.has(user.id) ) {
                //  강제 제거
                this.mUsers.delete(user.id);
                return;

                this.mUsers.set(user.id, user);
                user.updateInfo();
            }
        }catch(e) {

        }        
    }
}

module.exports = BlackJackLobby;