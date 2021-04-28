import * as PIXI from 'pixi.js-legacy'
import {calculateSurroundPoints} from "./calculateComponentPositionAndSize";
import Selection from "./selection";
import Component from "./component";
interface IGroup {
     needLockProportion: boolean,
     components: Component[]
}
class Group extends PIXI.Container{
    public selection: Selection;
    public components;
    public needLockProportion: boolean;
    public typeName: string;
    public uuid: string;
    constructor(params: IGroup) {
        super();
        const { needLockProportion, components} = params
        this.components = components;
        components.forEach((_, i) => {
            _.interactive = false;
            this.addChild(_)
        })
        const pointList = components.map(({selection}) => selection.border.points).reduce((previousValue, currentValue) => {
            return previousValue.concat(currentValue)
        },[]);
        const pointXList = pointList.map(p => p.x)
        const pointYList = pointList.map(p => p.y)
        const xMin =  Math.min(...pointXList);
        const xMax =  Math.max(...pointXList);
        const yMin =  Math.min(...pointYList);
        const yMax =  Math.max(...pointYList);
        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = new PIXI.Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
        this.pivot.x = (xMin + xMax)/2
        this.pivot.y = (yMin + yMax)/2
        this.position.set(this.pivot.x, this.pivot.y)
        this.angle =  0;
        this.zIndex =  9999;
        this.typeName = 'group';
        this.needLockProportion = !!needLockProportion;
    }
    public update(points = this.points) {
        this.selection.update(points)
    }
    public get proportion() {
        return this.width / this.height;
    }
    public get points() {
        const {left,right, top, bottom} = this.getBounds()
        return  calculateSurroundPoints({
            x: (left + right)/2,
            y: (top + bottom)/2
        }, this)
    }
}
export default Group;
