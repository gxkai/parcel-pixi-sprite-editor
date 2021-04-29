import * as PIXI from 'pixi.js-legacy';
declare class Mask extends PIXI.Graphics {
    constructor(points: PIXI.IPointData[]);
    update(points: PIXI.IPointData[]): void;
}
export default Mask;
