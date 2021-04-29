import * as PIXI from 'pixi.js-legacy';
import { v4 } from 'uuid';
import { calculateSurroundPoints } from "./calculateComponentPositionAndSize";
class Component extends PIXI.Sprite {
    constructor(params) {
        super(PIXI.Texture.from(params.url));
        this.name = 'component';
        this.uuid = params.uuid || v4();
        this.url = params.url;
        this.pid = params.pid;
        this.draw(params);
    }
    draw(params) {
        const { x, y, angle, zIndex, width, height, needLockProportion } = params;
        this.width = width;
        this.height = height;
        this.x = x + this.width / 2;
        this.y = y + this.height / 2;
        this.anchor.set(0.5);
        this.interactive = true;
        this.buttonMode = true;
        this.zIndex = zIndex;
        this.angle = angle;
        this.typeName = 'component';
        this.needLockProportion = !!needLockProportion;
        this.tint = 0x00ffff;
    }
    update(points = this.points) {
        this.selection.update(points);
    }
    get proportion() {
        return this.width / this.height;
    }
    get points() {
        return calculateSurroundPoints({
            x: this.x,
            y: this.y
        }, this);
    }
    select() {
        this.selection.visible = true;
        this.selection.border.visible = true;
        this.selection.dots.visible = true;
    }
}
export default Component;
