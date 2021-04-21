import * as PIXI from "pixi.js-legacy";

class Background extends PIXI.Sprite{
    constructor(params) {
        super(PIXI.Texture.WHITE);
        this.name = 'background';
        this.update(params)
    }
    public update(params) {
        this.width = params.width;
        this.height = params.height;
        this.tint = 0x000000;
        this.interactive = true;
    }
}
export default Background;
