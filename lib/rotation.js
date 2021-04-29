import * as PIXI from 'pixi.js-legacy';
class Rotation extends PIXI.Graphics {
    constructor(point, container) {
        super();
        this.update(point, container);
    }
    update(point, container) {
        const { x, y } = point;
        this.clear();
        this.interactive = true;
        this.buttonMode = true;
        this.lineStyle(10, 0x66CCFF, 1);
        const radian = container.angle * Math.PI / 180;
        this.arc(x, y - 10, 84, Math.PI / 3 + radian, Math.PI * 2 / 3 + radian, false);
    }
}
export default Rotation;
