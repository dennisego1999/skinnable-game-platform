import * as PIXI from 'pixi.js';

export default class PixiManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.app = null;
        this.fps = 1000 / 60;
        this.then = null;
        this.animateFrameId = null;
        this.ticker = PIXI.Ticker.shared;
        this.renderer = new PIXI.autoDetectRenderer();
        this.renderObject = null;
        this.renderAction = null;
    }

    createPixiApp() {
        //Create pixi app
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio,
            view: this.canvas
        });

        //Set resizeTo app canvas
        this.app.resizeTo = this.canvas;

        //Make stage children sortable
        this.app.stage.sortableChildren = true;
        this.app.stage.sortChildren();

        //Make sure stage is interactive
        this.app.stage.interactive = true;
    }

    disableRendering() {
        //Stop rendering
        this.app.stop();
        cancelAnimationFrame(this.animateFrameId);
    }

    enableRendering() {
        //Start rendering
        this.app.start();
        this.animate(performance.now());
    }

    setupRender(options) {
        //Set render object
        this.renderObject = options?.object;

        //Set render action
        this.renderAction = options?.action;

        //Don't start rendering
        this.ticker.autoStart = false;

        //Stop the shared ticker
        this.ticker.stop();
    }

    render(time) {
        //Render the app
        this.ticker.update(time);

        //Render the render object
        if (this.renderObject) {
            this.renderer.render(this.renderObject);
        }

        //Render render action
        if (this.renderAction) {
            this.renderAction();
        }
    }

    animate(time) {
        const now = Date.now();
        const delta = now - this.then;

        if (delta > this.fps) {
            this.then = now - (delta % this.fps);

            //Render
            this.render(time);
        }

        //Request the animation frame
        this.animateFrameId = requestAnimationFrame(this.animate.bind(this));
    }
}
