import * as PIXI from 'pixi.js-legacy';
class Mask extends PIXI.Graphics {
    constructor(points) {
        super();
        this.update(points);
    }
    update(points) {
        this.clear();
        this.lineStyle(2, 0xffffff);
        for (let [i, v] of points.entries()) {
            const { x, y } = v;
            if (i === 0) {
                this.moveTo(x, y);
            }
            else {
                this.lineTo(x, y);
            }
            if (i === points.length - 1) {
                const { x, y } = points[0];
                this.lineTo(x, y);
            }
        }
    }
}
export default Mask;
