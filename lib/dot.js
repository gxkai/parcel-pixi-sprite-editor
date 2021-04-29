import * as PIXI from 'pixi.js-legacy';
class Dot extends PIXI.Graphics {
    constructor(point, name) {
        super();
        this.name = name;
        this.update(point);
    }
    update(point) {
        this.clear();
        this.interactive = true;
        this.beginFill(0xffffff);
        this.drawCircle(point.x, point.y, 10);
        this.endFill();
    }
}
export default Dot;
