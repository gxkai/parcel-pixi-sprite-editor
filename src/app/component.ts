import * as PIXI from 'pixi.js-legacy';
import {v4} from 'uuid';
import Selection from './selection'
import {calculateSurroundPoints} from "./calculateComponentPositionAndSize";
interface IComponent {
    x: number,
    y:number,
    angle:number,
    zIndex:number,
    width:number,
    height:number,
    needLockProportion?: boolean,
    url: string,
    uuid?: string;
    pid?: string;
}
class Component extends PIXI.Sprite{
    public typeName: string;
    public url: string;
    public needLockProportion: boolean;
    public uuid: string;
    public pid: string;
    public selection: Selection;
    constructor(params: IComponent) {
        super(PIXI.Texture.from(params.url));
        this.name = 'component';
        this.uuid = params.uuid || v4();
        this.url = params.url;
        this.pid = params.pid;
        this.draw(params)
    }
    public draw(params) {
        const {x, y, angle, zIndex, width, height, needLockProportion} = params
        this.width = width;
        this.height = height;
        this.x = x  + this.width / 2;
        this.y = y + this.height / 2;
        this.anchor.set(0.5)
        this.interactive = true;
        this.buttonMode = true;
        this.zIndex = zIndex;
        this.angle = angle;
        this.typeName = 'component'
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
    public select() {
        this.selection.visible = true;
        this.selection.border.visible = true;
        this.selection.dots.visible = true;
    }
}
export default Component
