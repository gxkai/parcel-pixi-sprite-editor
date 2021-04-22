import * as PIXI from 'pixi.js-legacy'
import {calculateSurroundPoints} from "./calculateComponentPositionAndSize";
class Group extends PIXI.Container{
    constructor(params) {
        super();
        const {components} = params;
        components.forEach(_ => {
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
        this.pivot.set(this.width/2, this.height/2);
        this.position.set(this.width/2, this.height/2)
    }
    public get points() {
        return  calculateSurroundPoints({
            x: this.x,
            y: this.y
        }, this);
    }
}
export default Group;
