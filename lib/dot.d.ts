import * as PIXI from 'pixi.js-legacy';
declare class Dot extends PIXI.Graphics {
    constructor(point: PIXI.IPointData, name: string);
    update(point: PIXI.IPointData): void;
}
export default Dot;
