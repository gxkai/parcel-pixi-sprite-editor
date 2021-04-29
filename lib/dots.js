import * as PIXI from 'pixi.js-legacy';
class Dots extends PIXI.Container {
    constructor(dots) {
        super();
        this.name = 'dots';
        dots.forEach(_ => {
            this.addChild(_);
        });
        this.dots = dots;
    }
    update(points) {
        this.dots.forEach((_, i) => {
            _.update(points[i]);
        });
    }
}
export default Dots;
