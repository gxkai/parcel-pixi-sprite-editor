import * as PIXI from 'pixi.js'
class Dot extends PIXI.Graphics{
    constructor(point) {
        super();
        this.update(point)
    }
    private draw() {

    }

    public update(point) {
        this.clear()
        this.interactive = true;
        this.beginFill(0xffffff)
        this.drawCircle(point.x, point.y, 10);
        this.endFill()
    }
}
export default Dot
