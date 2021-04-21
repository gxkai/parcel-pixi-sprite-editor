import * as PIXI from 'pixi.js-legacy';
class Mask extends PIXI.Graphics{
    constructor(points: PIXI.IPointData[]) {
        super();
        this.update(points)
    }
    public update(points: PIXI.IPointData[]) {
        this.clear()
        this.lineStyle(2, 0xffffff)
        for (let [i, v] of points.entries()) {
            const {x, y} = v
            if (i===0) {
                this.moveTo(x, y);
            } else {
                this.lineTo(x, y)
            }
        }
    }
}
export default Mask
