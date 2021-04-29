import * as PIXI from 'pixi.js-legacy';
import Border from "./border";
import Dots from "./dots";
declare class Selection extends PIXI.Container {
    constructor(objects: PIXI.DisplayObject[]);
    update(points: any): void;
    get dots(): Dots;
    get border(): Border;
}
export default Selection;
