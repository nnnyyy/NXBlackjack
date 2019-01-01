'use strict'

let ONEDECK = [];

class BlackJackGame {
    constructor() {        
        this.initOneDeck();
    }

    initOneDeck() {
        for( let i = 1 ; i <= 13 * 4 ; ++i ) {
            ONEDECK.push(i);
        }
    }
}

module.exports = BlackJackGame;