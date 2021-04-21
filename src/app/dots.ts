import * as PIXI from 'pixi.js-legacy'
import Dot from "./dot";
class Dots extends PIXI.Container{
    constructor(dots: Dot[]) {
        super();
        this.name = 'dots';
        dots.forEach(_ => {
            this.addChild(_);
        })
    }
}
export default Dots;
