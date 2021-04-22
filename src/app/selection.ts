import * as PIXI from 'pixi.js-legacy'
import Border from "./border";
class Selection extends PIXI.Container{
    constructor(objects: PIXI.DisplayObject[]) {
        super();
        this.name = 'selection'
        objects.forEach(_ => {
            this.addChild(_);
        })
    }
    public update(points) {
        const [
            newLTPoint,
            newRTPoint,
            newLBPoint,
            newRBPoint,
            newTPoint,
            newBPoint,
            newLPoint,
            newRPoint,
            newUBPoint
        ] = points;
        this.dots.update([newLTPoint,
            newRTPoint,
            newLBPoint,
            newRBPoint,
            newTPoint,
            newBPoint,
            newLPoint,
            newRPoint,
            newUBPoint]);
        this.border.update([
            newLTPoint,
            newRTPoint,
            newRBPoint,
            newLBPoint,
        ])
    }
    public get dots() {
        const dots = this.children.find(q => q.name === 'dots') as Border;
        return dots
    }
    public get border() {
        const border = this.children.find(q => q.name === 'border') as Border;
        return border;
    }
}
export default Selection;
