import * as PIXI from 'pixi.js'
class Component extends PIXI.Sprite{
    public typeName: string;
    public needLockProportion: boolean;
    constructor(params) {
        super(PIXI.Texture.from(params.url));
        this.update(params)
    }
    public update(params) {
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
        this.typeName = typeName || 'group'
        this.needLockProportion = !!needLockProportion;
    }
    public get proportion() {
        return this.width / this.height;
    }
}
export default Component
