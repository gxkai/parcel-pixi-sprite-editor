import * as PIXI from 'pixi.js-legacy';
import UUID from 'uuidjs';
import Selection from './selection'
import {calculateSurroundPoints} from "./calculateComponentPositionAndSize";
class Component extends PIXI.Sprite{
    public typeName: string;
    public url: string;
    public needLockProportion: boolean;
    public uuid: string;
    public pid: string;
    public selection: Selection;
    constructor(params) {
        super(params.url ? PIXI.Texture.from(params.url) : PIXI.Texture.EMPTY);
        this.name = 'component';
        this.uuid = params.uuid || UUID.generate();
        this.url = params.url;
        this.draw(params)
    }
    public draw(params) {
        const {x, y, angle, zIndex, w, h, typeName, needLockProportion} = params
        this.width = w;
        this.height = h;
        this.x = x  + this.width / 2;
        this.y = y + this.height / 2;
        this.anchor.set(0.5)
        this.interactive = true;
        this.buttonMode = true;
        this.zIndex = zIndex;
        this.angle = angle;
        this.typeName = typeName || 'single'
        this.needLockProportion = !!needLockProportion;
        this.tint = 0x00ffff
    }
    public update(points = this.points) {
        this.selection.update(points)
    }
    public get proportion() {
        return this.width / this.height;
    }
    public get points() {
        return  calculateSurroundPoints({
            x: this.x,
            y: this.y
        }, this);
    }
}
export default Component
