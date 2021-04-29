import * as PIXI from 'pixi.js-legacy';
import Dot from "./dot";
declare class Dots extends PIXI.Container {
    dots: Dot[];
    constructor(dots: Dot[]);
    update(points: PIXI.IPointData[]): void;
}
export default Dots;
