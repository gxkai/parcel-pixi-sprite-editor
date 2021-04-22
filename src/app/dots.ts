import * as PIXI from 'pixi.js-legacy'
import Dot from "./dot";
class Dots extends PIXI.Container{
    private dots: Dot[];
    constructor(dots: Dot[]) {
        super();
        this.name = 'dots';
        dots.forEach(_ => {
            this.addChild(_);
        })
        this.dots = dots;
    }
    public update(points: PIXI.IPointData[]) {
        this.dots.forEach((_,i) => {
            _.update(points[i])
        })
    }
}
export default Dots;
