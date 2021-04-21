import * as PIXI from 'pixi.js-legacy';
import UUID from 'uuidjs';
class Component extends PIXI.Sprite{
    public typeName: string;
    public needLockProportion: boolean;
    public uuid: string;
    constructor(params) {
        super(PIXI.Texture.from(params.url));
        this.name = 'component';
        this.update(params)
    }
    public update(params) {
        const {x, y, angle, zIndex, w, h, typeName, needLockProportion, uuid} = params
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
        this.uuid = uuid || UUID.genV4();
    }
    public get proportion() {
        return this.width / this.height;
    }
}
export default Component
