import Transformer from "./app/transformer";
import Component from "./app/component";
import * as PIXI from "pixi.js-legacy";
(window as any).PIXI = PIXI;
let app: PIXI.Application;
function App(parent: HTMLElement, WORLD_WIDTH: number, WORLD_HEIGHT: number) {
    app = new PIXI.Application({backgroundColor: 0x000000, antialias:true,forceCanvas: false, resolution: 2});
    app.renderer.autoDensity = true;
    app.renderer.resize(WORLD_WIDTH, WORLD_HEIGHT)
    parent.replaceChild(app.view, parent.lastElementChild); // Hack for parcel HMR
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    // object
    const params = {
        url: "assets/mask.png",
        width: 200,
        height: 200,
        x: 100,
        y: 500,
        angle: 0,
        zIndex: 20,
    }
    const params3 = {
        url: "assets/mask.png",
        width: 200,
        height: 200,
        x: 100,
        y: 200,
        angle: 0,
        zIndex: 20,
    }
    const comp2 = new Transformer(new Component(params3), app).object;
    const comp1 = new Transformer(new Component(params), app).object;
    app.stage.addChild(comp2)
    app.stage.addChild(comp1)
}

App(document.body,  window.innerWidth, window.innerHeight);
