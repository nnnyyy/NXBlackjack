'use strict'

import {Container} from 'pixi.js'
import {WebGLRenderer} from 'pixi.js'
import {Sprite} from 'pixi.js'
import {Graphics} from 'pixi.js'
import {Filter} from 'pixi.js'
import {Matrix} from 'pixi.js'

class PixiTitleCanvas {
    constructor() {
    }

    create(element) {        
        cvs.width = 800
        cvs.height = 540
        this.renderer = new PIXI.WebGLRenderer(element.width, element.height, {backgroundColor : 0xffffff, view: element, antialias: true} )
        this.container = new PIXI.Container();            

        this.basicText = new PIXI.Text('Basic text in pixi');
        this.basicText.x = 0;
        this.basicText.y = 0;

        this.container.addChild(this.basicText);            

        let ticker = PIXI.ticker.shared;
        // Set this to prevent starting this ticker when listeners are added.
        // By default this is true only for the PIXI.Ticker.shared instance.
        ticker.autoStart = false;
        // FYI, call this to ensure the ticker is stopped. It should be stopped
        // if you have not attempted to render anything yet.
        ticker.stop();
        // Call this when you are ready for a running shared ticker.
        ticker.start();

        ticker.add( time => {
            this.update(time);
        }); 
    }

    update(time) {
        this.renderer.render(this.container);
        this.basicText.rotation += 0.1 * time;
    }
}

const _obj = new PixiTitleCanvas();

export default _obj