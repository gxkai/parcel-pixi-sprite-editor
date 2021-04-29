import * as PIXI from 'pixi.js-legacy';
declare class Border extends PIXI.Graphics {
    private _points;
    constructor(points: PIXI.IPointData[]);
    update(points: PIXI.IPointData[]): void;
    get points(): PIXI.IPointData[];
}
export default Border;
